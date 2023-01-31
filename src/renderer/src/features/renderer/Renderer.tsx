import { ComponentData } from '@kitae/shared/types'
import { useDesignerState } from '@renderer/features/designer'
import { Component, createMemo, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { components } from './components'

const Renderer: Component = () => {
  const [state] = useDesignerState()
  const page = createMemo((): ComponentData | undefined => {
    return state.data?.pages.find((p) => p.id === state.page) ?? state.data?.pages[0] ?? undefined
  })
  return (
    <Show when={page()}>
      <Dynamic component={components[page()!.type]} data={page()} />
    </Show>
  )
}

export default Renderer
