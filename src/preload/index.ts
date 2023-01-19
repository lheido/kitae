import { electronAPI } from '@electron-toolkit/preload'
import { KitaeWindowAPI, WindowArgs } from '@shared/types'
import { contextBridge } from 'electron'

export const parser = (argv: string[]): { [k: string]: string } => {
  return argv.reduce((o, arg) => {
    if (arg.indexOf('--') === 0) {
      const [name, value] = arg.split('=')
      o[name.slice(2)] = value
    }
    return o
  }, {})
}

const windowArgs: WindowArgs = parser(process.argv) as never

// Custom APIs for renderer
const api: KitaeWindowAPI = {
  windowArgs
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
