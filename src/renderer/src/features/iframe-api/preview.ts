import { IframeApiEvents } from './types'

export const invoke = <T, X>(channel: IframeApiEvents, data?: T): Promise<X> => {
  return new Promise((resolve) => {
    const listener = (e: MessageEvent): void => {
      if (e.data.channel === channel) {
        resolve(e.data.data)
        window.removeEventListener('message', listener)
      }
    }
    window.addEventListener('message', listener)
    window.parent.postMessage({ channel, data }, '*')
  })
}

export const on = <T>(channel: IframeApiEvents, handler: (data?: T) => void): VoidFunction => {
  const listener = (e: MessageEvent): void => {
    if (e.data.channel === channel) {
      handler(e.data.data)
    }
  }
  window.addEventListener('message', listener)
  return (): void => window.removeEventListener('message', listener)
}
