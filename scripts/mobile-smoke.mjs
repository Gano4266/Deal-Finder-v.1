import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = (process.env.DEAL_FINDER_SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outputDir = process.env.DEAL_FINDER_MOBILE_SMOKE_DIR || path.join(repoRoot, "artifacts", "mobile-smoke");
const viewport = { width: 390, height: 844, deviceScaleFactor: 3 };

const pages = [
  { path: "/tonight", name: "tonight", needles: ["Today's forecast", "Verify details before you order"] },
  { path: "/deals?quick=lunch", name: "deals-lunch", needles: ["Food specials worth knowing", "Lunch"] },
  { path: "/deals/deal-beat-street-tuesday-2-tacos", name: "deal-detail", needles: ["$2 tacos", "Check official details"] },
  { path: "/restaurants", name: "restaurants", needles: ["Restaurants Forkcast is watching", "On our radar"] },
  { path: "/report", name: "report", needles: ["Share a Forkcast update", "Send a special"] }
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForExit(child, timeoutMs = 2_000) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, timeoutMs);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function waitForJson(url, timeoutMs = 10_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Chrome is still starting.
    }

    await delay(100);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function createCdpClient(wsUrl) {
  let nextId = 1;
  const pending = new Map();
  const ws = new WebSocket(wsUrl);

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);

    if (message.error) {
      reject(new Error(message.error.message));
      return;
    }

    resolve(message.result ?? {});
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId;
          nextId += 1;

          return new Promise((sendResolve, sendReject) => {
            pending.set(id, { resolve: sendResolve, reject: sendReject });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        close() {
          ws.close();
        }
      });
    });
    ws.addEventListener("error", reject);
  });
}

async function findFreePort() {
  const { default: net } = await import("node:net");

  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on("error", reject);
  });
}

function safeName(name) {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

async function waitForReady(client) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const result = await client.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true
    });

    if (result.result?.value === "complete") {
      await delay(250);
      return;
    }

    await delay(100);
  }

  throw new Error("Timed out waiting for page readyState=complete");
}

async function smokePage(page) {
  const port = await findFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "deal-finder-chrome-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${viewport.width},${viewport.height}`,
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let stderr = "";
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  let client;

  try {
    const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`);
    const target = targets.find((item) => item.type === "page");
    assert(target?.webSocketDebuggerUrl, "Chrome page target was not available");

    client = await createCdpClient(target.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor,
      mobile: true
    });
    await client.send("Page.navigate", { url: `${baseUrl}${page.path}` });
    await waitForReady(client);

    const metrics = await client.send("Runtime.evaluate", {
      expression: `(() => {
        const doc = document.documentElement;
        const body = document.body;
        const text = body.innerText || "";
        const horizontalOverflow = Math.max(doc.scrollWidth, body.scrollWidth) - doc.clientWidth;
        const visibleActions = Array.from(document.querySelectorAll("a, button, input, select, textarea, [role='button']"))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return rect.width >= 32 && rect.height >= 32 && style.visibility !== "hidden" && style.display !== "none";
          }).length;
        const visibleImages = Array.from(document.images).filter((image) => {
          const rect = image.getBoundingClientRect();
          return image.complete && image.naturalWidth > 0 && rect.width > 40 && rect.height > 40;
        }).length;

        return { horizontalOverflow, visibleActions, visibleImages, text };
      })()`,
      returnByValue: true
    });
    const value = metrics.result?.value;

    assert(value, `${page.path}: missing mobile metrics`);
    assert(value.horizontalOverflow <= 2, `${page.path}: horizontal overflow ${value.horizontalOverflow}px`);
    assert(value.visibleActions > 0, `${page.path}: expected at least one tappable action`);

    for (const needle of page.needles) {
      assert(value.text.includes(needle), `${page.path}: missing mobile text ${JSON.stringify(needle)}`);
    }

    if (page.path.startsWith("/deals/")) {
      assert(value.visibleImages > 0, `${page.path}: expected visual proof image to render`);
    }

    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false
    });
    const screenshotPath = path.join(outputDir, `${safeName(page.name)}.png`);
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));

    console.log(`ok mobile ${page.path} -> ${path.relative(repoRoot, screenshotPath)}`);
  } finally {
    client?.close();
    if (chrome.exitCode === null && chrome.signalCode === null) {
      chrome.kill("SIGTERM");
      await waitForExit(chrome);
    }

    if (chrome.exitCode === null && chrome.signalCode === null) {
      chrome.kill("SIGKILL");
      await waitForExit(chrome);
    }

    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }

  if (chrome.exitCode && chrome.exitCode !== 0) {
    throw new Error(`Chrome exited with ${chrome.exitCode}: ${stderr}`);
  }
}

assert(fs.existsSync(chromePath), `Chrome not found at ${chromePath}. Set CHROME_PATH to override.`);
fs.mkdirSync(outputDir, { recursive: true });

for (const page of pages) {
  await smokePage(page);
}

console.log(`\nMobile smoke passed: ${pages.length} iPhone-size pages. Screenshots: ${path.relative(repoRoot, outputDir)}`);
