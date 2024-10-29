// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        debriefs: resolve(__dirname, 'debriefs/index.html'),
        modules: resolve(__dirname, 'src/modules/test.html'),
      },
    },
  },
})