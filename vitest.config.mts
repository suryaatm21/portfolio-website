import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: projectRoot,
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: [path.join(projectRoot, "tests/setup/vitest.setup.ts")],
    include: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    globals: true,
    coverage: {
      enabled: process.env.VITEST_COVERAGE === "1",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "tests/setup/",
        "**/*.config.*",
        "**/*.d.ts",
        ".next/",
        "coverage/",
      ],
    },
  },
});
