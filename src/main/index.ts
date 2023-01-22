import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { Workspace } from '@kitae/shared/types'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { basename, join } from 'path'
import icon from '../../resources/icon.png?asset'
import { getSettings, updateSettings } from './settings'
import { fetchWorkspaces, updateWorkspaces } from './workspaces'

const TITLE_BAR_OVERLAY_HEIGHT = 36

let mainWindow: BrowserWindow

function createWindow(): void {
  const settings = getSettings()
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: settings.window?.width ?? 900,
    height: settings.window?.height ?? 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#332E38',
      symbolColor: '#B8B0BF',
      height: TITLE_BAR_OVERLAY_HEIGHT
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      additionalArguments: [`--title-bar-overlay-height=${TITLE_BAR_OVERLAY_HEIGHT}`],
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('maximize', () => {
    updateSettings('window.maximized', true)
  })
  mainWindow.on('unmaximize', () => {
    updateSettings('window.maximized', false)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainWindow.on('resized', () => {
    const bounds = mainWindow.getBounds()
    updateSettings('window', {
      ...(getSettings().window ?? {}),
      width: bounds.width,
      height: bounds.height
    })
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools({ mode: 'left' })
    if (settings.window?.maximized) {
      mainWindow.maximize()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.kitae')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('get-workspaces', () => {
  return fetchWorkspaces()
})

ipcMain.handle('update-workspaces', (_, workspaces) => {
  return updateWorkspaces(workspaces)
})

ipcMain.handle('local:open-workspace', () => {
  const paths = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  })
  if (!paths) {
    return false
  }
  const items = fetchWorkspaces()
  const initialLenght = items.length
  const itemsToAdd = paths
    .map((path) => {
      const name = basename(path)
      const id = Buffer.from(path).toString('base64')
      return {
        id,
        name,
        previewUrl: 'http://localhost:3000',
        backends: [
          {
            name: 'local',
            path
          }
        ]
      } as Workspace
    })
    .filter((w) => !items.find((i) => i.id === w.id))
  itemsToAdd.forEach((w) => items.push(w))
  if (initialLenght !== items.length) {
    updateWorkspaces(items)
    return itemsToAdd.map((i) => i.id)
  }
  return false
})
