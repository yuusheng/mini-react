import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'mini-react': resolve('./packages/core/src'),
    },
  },
})
