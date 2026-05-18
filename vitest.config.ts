import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@test-utils': path.resolve(__dirname, './src/lib/test-utils'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        '**/*.d.ts',
        '**/models/**',
        '**/constants/**',
        '**/interfaces/**',
      ],
      thresholds: {
        statements: 70,
        branches: 90,
        functions: 50,
        lines: 70,
      },
    },
  },
})