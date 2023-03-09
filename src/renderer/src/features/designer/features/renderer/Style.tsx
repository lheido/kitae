/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, For, Show } from 'solid-js'
import { renderClasses } from '../properties/properties-renderer'
import { useDesignerState } from '../state/designer.state'

const cleanClassName = (className: string): string =>
  className.replaceAll(':', '\\:').replaceAll('.', '\\.')

const getModifier = (className: string): string => {
  const splitedClassName = className.split(':')
  if (splitedClassName.length < 2) return ''
  return `:${splitedClassName[0]}`
}

const Style: Component = () => {
  const [state] = useDesignerState()
  return (
    <style>
      <Show when={state.data?.theme}>
        <For each={Object.entries(renderClasses(state.data!.theme))}>
          {([className, content]): any => (
            <>{`.${cleanClassName(className)}${getModifier(className)} { ${content} }`}</>
          )}
        </For>
      </Show>
    </style>
  )
}

export default Style
