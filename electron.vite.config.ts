/// <reference types="vitest" />
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import solid from 'vite-plugin-solid'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['@kitae/local-backend', '@kitae/shared'] })]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    optimizeDeps: {
      extensions: ['jsx']
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [solid()]
  }
})
