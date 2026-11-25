import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node scripts (CommonJS) and the HTML design exports are not app code.
    "scripts/**",
    "public/**",
    "stitch_*/**",
    ".sfdx/**",
  ]),
  {
    rules: {
      // Arrived with the React 19 lint rules. It flags the "fetch on mount,
      // then setState" effects this codebase uses for all its data loading —
      // a pattern, not 20 separate bugs. Kept visible as a warning until the
      // data hooks are reworked, instead of being silenced file by file.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
