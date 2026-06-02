import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(repoRoot, "app");

function readEnvFile(relativePath) {
  const envPath = path.join(appDir, relativePath);

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    fs.readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return [line, ""];
        }

        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      })
  );
}

const localEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...process.env
};
const reportEmail = localEnv.NEXT_PUBLIC_REPORT_EMAIL ?? "";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? appDir,
      env: { ...localEnv, ...(options.env ?? {}) },
      stdio: options.stdio ?? "inherit"
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on("error", reject);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, timeoutMs = 20_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/tonight`);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function startProductionServer(port) {
  const server = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    cwd: appDir,
    env: {
      ...localEnv,
      DEAL_FINDER_ADMIN_ENABLED: "false"
    },
    stdio: ["ignore", "inherit", "inherit"]
  });

  server.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`Production smoke server exited with ${code}`);
    }
  });

  return server;
}

async function stopServer(server) {
  if (server.exitCode !== null) {
    return;
  }

  server.kill("SIGTERM");
  await delay(500);

  if (server.exitCode === null) {
    server.kill("SIGKILL");
  }
}

console.log("accept: validate data");
await run("npm", ["run", "validate:data"]);

console.log("accept: typecheck");
await run("npm", ["run", "lint"]);

console.log("accept: production build");
await run("npm", ["run", "build"]);

if (!reportEmail) {
  console.warn("accept warning: NEXT_PUBLIC_REPORT_EMAIL is not set; report intake is not ready for unguided testing.");
}

const port = await findFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = await startProductionServer(port);

try {
  await waitForServer(baseUrl);

  console.log("accept: production route smoke");
  await run("node", ["../scripts/smoke-app.mjs"], {
    env: {
      DEAL_FINDER_SMOKE_BASE_URL: baseUrl,
      DEAL_FINDER_SMOKE_ADMIN_MODE: "disabled"
    }
  });

  console.log("accept: mobile visual smoke");
  await run("node", ["../scripts/mobile-smoke.mjs"], {
    env: {
      DEAL_FINDER_SMOKE_BASE_URL: baseUrl
    }
  });
} finally {
  await stopServer(server);
}

console.log("\naccept passed: data, typecheck, build, production smoke, admin-disabled gate, and mobile smoke are green.");
