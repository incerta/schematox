import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        functions: 100,
        lines: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
