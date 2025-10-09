import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vitest configuration for local testing
 * - Uses jsdom for DOM simulation
 * - Resolves path aliases from tsconfig.json
 * - Sets up testing environment for React components
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    globals: true,
    // Coverage is optional - enable with VITEST_COVERAGE=1
    coverage: {
      enabled: process.env.VITEST_COVERAGE === '1',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup/',
        '**/*.config.*',
        '**/*.d.ts',
        '.next/',
        'coverage/',
      ],
    },
  },
});
