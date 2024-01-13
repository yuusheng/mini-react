import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '~': resolve('src'),
    },
  },
})
