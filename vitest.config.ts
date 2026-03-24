import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: [
        path.join(rootDir, "apps/student/tsconfig.json"),
        path.join(rootDir, "apps/admin/tsconfig.json"),
        path.join(rootDir, "apps/web/tsconfig.json"),
        path.join(rootDir, "apps/teacher/tsconfig.json"),
        path.join(rootDir, "packages/ui/tsconfig.json"),
        path.join(rootDir, "packages/shared/tsconfig.json"),
        path.join(rootDir, "packages/utils/tsconfig.json"),
      ],
      ignoreConfigErrors: true,
      loose: true,
    }),
  ],
  root: rootDir,
  test: {
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
    environment: "jsdom",
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/tests/e2e/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./tests/setup/vitest.setup.tsx"],
  },
});
