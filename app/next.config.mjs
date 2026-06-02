import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(appDir, "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/*": [
      "../fixtures/prototype/**/*",
      "../ops/seeds/**/*"
    ],
    "/admin/*": [
      "../ops/**/*",
      "../research/**/*"
    ]
  },
  turbopack: {
    root: repoRoot
  }
};

export default nextConfig;
