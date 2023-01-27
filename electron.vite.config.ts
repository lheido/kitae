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
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [solid()]
  }
})
