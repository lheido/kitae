import { ElectronAPI } from '@electron-toolkit/preload'
import { KitaeWindowAPI } from '@shared/types'

export const api = window['api'] as KitaeWindowAPI

export const electronApiFn = [
  'on',
  'once',
  'removeAllListeners',
  'removeListener',
  'send',
  'invoke',
  'postMessage',
  'sendSync',
  'sendTo',
  'sendToHost',
  'insertCSS',
  'setZoomFactor',
  'setZoomLevel'
]
export const electron = new Proxy(window['electron'] as ElectronAPI, {
  get: (target, prop): unknown => {
    if (prop in target) {
      return target[prop]
    }
    return new Proxy(
      {},
      {
        get: (_, prop): unknown => {
          if (electronApiFn.includes(prop as string)) {
            return () => void 0
          }
          // do nothing.
          return void 0
        }
      }
    )
  }
})
