import { defineConfig } from "vitest/config";

// Security-rule tests run against the Firebase emulators, so they live apart
// from the unit suite (`npm test`) and are launched by `npm run test:rules`,
// which starts the emulators around them.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.rules.test.ts"],
    testTimeout: 20000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
