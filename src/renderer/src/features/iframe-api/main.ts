import { IframeApiEvents } from './types'

export const handle = (
  target: HTMLIFrameElement,
  channel: IframeApiEvents,
  handler: (data?: unknown) => void
): VoidFunction => {
  const listener = (e: MessageEvent): void => {
    if (e.source !== target.contentWindow) {
      return
    }
    if (e.data.channel === channel) {
      e.source?.postMessage({ channel, data: handler(e.data) }, e.origin)
    }
  }
  window.addEventListener('message', listener)
  return (): void => window.removeEventListener('message', listener)
}

export const send = (source: HTMLIFrameElement, channel: IframeApiEvents, data?: unknown): void => {
  source.contentWindow?.postMessage({ channel, data }, '*')
}
