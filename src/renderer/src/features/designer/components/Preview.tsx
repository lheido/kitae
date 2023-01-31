import { api } from '@renderer/features/api'
import { historyEvent, useHistory } from '@renderer/features/history'
import { handle, send } from '@renderer/features/iframe-api/main'
import { Component, createEffect, onCleanup, onMount } from 'solid-js'
import { useDesignerState } from '../designer.state'

const Preview: Component = () => {
  let iframeRef: HTMLIFrameElement | undefined
  const [state] = useDesignerState()
  const [historyState] = useHistory()
  const unsubscriber: VoidFunction[] = []
  onMount(() => {
    if (iframeRef) {
      unsubscriber.push(
        handle(iframeRef, 'request-workspace-data', () => JSON.parse(JSON.stringify(state.data)))
      )
    }
  })
  createEffect(() => {
    const event = historyEvent()
    if (iframeRef && event !== undefined) {
      switch (event) {
        case 'change':
          send(
            iframeRef,
            'workspace-data-changes',
            JSON.parse(JSON.stringify(historyState.history[historyState.history.length - 1]))
          )
          break
        case 'undo':
          send(iframeRef, 'undo')
          break
        case 'redo':
          send(iframeRef, 'redo')
          break

        default:
          break
      }
    }
  })
  onCleanup(() => {
    unsubscriber.forEach((fn) => fn())
  })
  return (
    <>
      <header class="py-2 px-3">Preview header</header>
      <div class="bg-base-300 flex-1 rounded-t-lg overflow-hidden">
        <iframe ref={iframeRef} class="w-full h-full" src={api.windowArgs?.['kitae-preview-url']} />
      </div>
    </>
  )
}

export default Preview
