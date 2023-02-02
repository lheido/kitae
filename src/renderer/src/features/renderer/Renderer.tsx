import { ComponentData } from '@kitae/shared/types'
import Toast from '@renderer/components/Toast'
import { useDesignerState } from '@renderer/features/designer'
import { Component, createMemo, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { components } from './components'

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
      <Dynamic component={components[page()!.type]} data={page()} />
    </Show>
  )
}

export default Renderer
