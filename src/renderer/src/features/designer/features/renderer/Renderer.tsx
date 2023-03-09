import { ComponentData } from '@kitae/shared/types'
import Toast from '@renderer/components/Toast'
import { useDesignerState } from '@renderer/features/designer'
import { customElement } from 'solid-element'
import { Component, createMemo, Show } from 'solid-js'
import rendererCSS from '../../../../assets/renderer.css?inline'
import Children from './Children'
import Style from './Style'

declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'kitae-renderer'?: any
    }
  }
}

const Renderer: Component = () => {
  const [state] = useDesignerState()
  const page = createMemo((): ComponentData | undefined => {
    return state.data?.pages.find((p) => p.id === state.page) ?? undefined
  })
  return (
    <Show
      when={state.data && state.data.pages.length > 0 && page()}
      fallback={
        <Toast type="info" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Select a page to see something here
        </Toast>
      }
    >
      <kitae-renderer />
    </Show>
  )
}

export default Renderer

customElement('kitae-renderer', () => {
  const [state] = useDesignerState()
  const page = createMemo((): ComponentData | undefined => {
    return state.data?.pages.find((p) => p.id === state.page) ?? undefined
  })
  return (
    <>
      <style>{rendererCSS}</style>
      <Style />
      <Children data={page() as ComponentData} />
    </>
  )
})
