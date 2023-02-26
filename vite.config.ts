import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic',
  })],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
})
