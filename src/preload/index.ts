import { electronAPI } from '@electron-toolkit/preload'
import { UiApi, WindowArgs } from '@kitae/shared/types'
import { contextBridge, ipcRenderer } from 'electron'

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
const api: UiApi = {
  windowArgs,
  getUserSettings: () => {
    return ipcRenderer.invoke('get-user-settings')
  },
  setUserSettings: (settings) => {
    return ipcRenderer.invoke('set-user-settings', settings)
  },
  getWorkspaces: () => {
    return ipcRenderer.invoke('get-workspaces')
  },
  updateWorkspaces: (workspaces) => {
    return ipcRenderer.invoke('update-workspaces', workspaces)
  },
  openLocalWorkspace: () => {
    return ipcRenderer.invoke('local:open-workspace')
  },
  getWorkspaceData: (workspace) => {
    return ipcRenderer.invoke('get-workspace-data', workspace)
  },
  setWorkspaceData: (workspace, data) => {
    return ipcRenderer.invoke('set-workspace-data', workspace, data)
  }
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
