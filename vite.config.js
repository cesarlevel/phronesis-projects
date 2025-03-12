// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [mkcert()],
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
  server: {
    https: true,
  },
})
