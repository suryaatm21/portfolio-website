/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
  ],
  plugins: ["import"],
  rules: {
    // Import organization and validation
    "import/no-unresolved": "error",
    "import/order": [
      "warn",
      {
        "alphabetize": { "order": "asc" },
        "newlines-between": "always",
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal",
            "position": "before",
          },
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
      },
    ],
    // Enforce consistent code style per instructions
    "quotes": ["error", "double"],
    "prefer-template": "error",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json",
      },
    },
  },
};