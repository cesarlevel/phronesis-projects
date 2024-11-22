// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        debriefs: resolve(__dirname, 'src/modules/debriefs.html'),
        home: resolve(__dirname, 'src/modules/home.html'),
        casinoDeposit: resolve(__dirname, 'src/modules/casino-deposit.html'),
        casinoPayout: resolve(__dirname, 'src/modules/casino-payout.html'),
      },
    },
  },
})