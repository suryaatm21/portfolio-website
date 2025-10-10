# Testing & Validation Framework

This document describes the local-first testing and validation setup for the portfolio website.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run full validation pipeline
npm run validate

# Watch tests during development
npm run test:watch
```

## 📋 Available Commands

### Core Validation

- `npm run validate` - Full validation pipeline (typecheck + lint + test + build)
- `npm run typecheck` - TypeScript type checking only
- `npm run lint` - ESLint checking
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Production build validation

### Coverage (Optional)

```bash
# Enable test coverage reporting
VITEST_COVERAGE=1 npm run test
```

## 🏗️ Framework Overview

### TypeScript Configuration

- **Strict mode enabled** with `noImplicitAny` and `noUncheckedIndexedAccess`
- **Path aliases** configured (`@/*` → `./`)
- **Test-specific config** in `tsconfig.test.json`

### ESLint Setup

- Extends `next/core-web-vitals`
- **Import validation** with `import/no-unresolved`
- **Import ordering** with alphabetical sorting
- **Code style** enforces double quotes and template literals

### Testing Stack

- **Vitest** with jsdom environment
- **Testing Library** for component testing utilities
- **Path alias resolution** via `vite-tsconfig-paths`
- **Setup file** at `tests/setup/vitest.setup.ts`

### Git Hooks (Husky + lint-staged)

- **Pre-commit**: Auto-fixes linting issues on staged files
- **Pre-push**: Runs full validation pipeline

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("Component Name", () => {
  it("should do something specific", () => {
    // Test implementation
    expect(something).toBe(expected);
  });
});
```

### Testing Location

- Place tests in `**/__tests__/**/*.{ts,tsx}`
- Or name them `*.test.{ts,tsx}`
- Component tests go in `components/__tests__/`

### Path Aliases in Tests

```typescript
// These imports work automatically
import { hero } from "@/content/site";
import { Button } from "@/components/ui/button";
```

## 🐛 Common Issues & Fixes

### Import Resolution Errors

```bash
# If ESLint shows "import/no-unresolved" errors:
npm run typecheck  # Check if TypeScript can resolve
```

**Fix**: Ensure path is correct and matches `tsconfig.json` paths configuration.

### Test Environment Issues

```bash
# If tests fail with module resolution:
npm run test -- --reporter=verbose
```

**Fix**: Check `vitest.config.ts` has `vite-tsconfig-paths` plugin enabled.

### Build Failures After Code Changes

```bash
# Always run validation after changes:
npm run validate
```

**Fix**: Address TypeScript errors first, then ESLint issues, then test failures.

### Husky Hook Failures

```bash
# If pre-commit hook fails:
npm run lint:fix
git add .
git commit -m "message"
```

## 📈 Expanding Tests

### Adding Component Tests

1. Create `components/__tests__/ComponentName.test.tsx`
2. Import component using path alias: `@/components/ComponentName`
3. Use Testing Library utilities for rendering and assertions
4. Mock external dependencies (framer-motion, etc.) as needed

### Mock Examples

```typescript
// Mock framer-motion for components using animations
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
  },
}));

// Mock window APIs
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn(() => ({ matches: false, addEventListener: vi.fn() })),
});
```

### Integration Tests

- Test API routes in `app/api/` with request/response mocking
- Test page components with Next.js router mocking
- Focus on user workflows rather than implementation details

### E2E Testing (Optional)

While not included by default, you can add Playwright for E2E:

```bash
npm install --save-dev @playwright/test
# Add "e2e": "playwright test" to package.json scripts
```

## 🎯 Best Practices

1. **Keep tests fast**: Mock heavy dependencies (animations, external APIs)
2. **Test behavior, not implementation**: Focus on user interactions and outputs
3. **Use path aliases**: Import using `@/` for consistency
4. **Validate often**: Run `npm run validate` before commits
5. **Fix issues early**: Address TypeScript errors before ESLint warnings

## 🔧 Troubleshooting Development

### Slow TypeScript Checking

```bash
# Use incremental compilation
npm run typecheck -- --incremental
```

### ESLint Performance

```bash
# Lint specific files only
npm run lint -- --file components/specific-file.tsx
```

### Test Performance

```bash
# Run specific test file
npm run test -- components/__tests__/specific.test.tsx
```

---

**Goal**: Catch import/compilation/runtime mistakes early with minimal setup overhead.
