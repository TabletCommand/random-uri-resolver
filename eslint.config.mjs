import { defineConfig } from "eslint/config";
import globals from "globals";
import promise from "eslint-plugin-promise";
import security from "eslint-plugin-security";
import tsParser from "@typescript-eslint/parser";
import neostandard, { plugins } from "neostandard";

export default defineConfig([
  ...neostandard({
    env: [
      "node",
    ],
    ts: true,
  }),
  plugins.n.configs["flat/recommended"],
  //
  {
    plugins: {
      promise,
      security,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2019,
      sourceType: "commonjs",

      parserOptions: {
        project: "./src/tsconfig.json",
      },
    },

    settings: {
      node: {
        version: ">=24.15.0",
      }
    },

    rules: {
      // ...tsPlugin.configs.all.rules,
      "@typescript-eslint/await-thenable": [1],
      "@typescript-eslint/no-floating-promises": [1],
      "@typescript-eslint/no-for-in-array": [1],
      "@typescript-eslint/no-misused-promises": [1],

      "@typescript-eslint/no-empty-interface": 0,
      "@typescript-eslint/no-empty-object-type": 0,
      "@typescript-eslint/require-await": [1],
      quotes: [2, "double"],
      semi: [2, "always"],
      // The correct way to use no-unused-vars in a TS project
      "@typescript-eslint/no-unused-vars": [1],
      "@typescript-eslint/promise-function-async": [1],
      "no-unused-vars": [0],
      //
      "@stylistic/quotes": [2, "double"],
      "@stylistic/space-before-function-paren": [0],
      "@stylistic/semi": [2, "always"],
      "import-x/first": [0],
      "camelcase": [0],
      "n/no-process-exit": [0],
      "n/no-unpublished-import": ["error", {
        "allowModules": ["chai"]
      }],
      // this is a workaround for import of .ts files
      "n/no-missing-import": [0],
    },
  },
  // Disable this for tests, because node:test marked describe/it as async
  {
    files: ["src/test/**"],
    rules: {
      "@typescript-eslint/no-floating-promises": [0],
    },
  }
]);
