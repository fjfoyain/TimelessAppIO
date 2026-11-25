import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Security-rule tests run against the Firebase emulators, so they live apart
// from the unit suite (`npm test`) and are launched by `npm run test:rules`,
// which starts the emulators around them.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.rules.test.ts"],
    testTimeout: 20000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
