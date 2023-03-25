/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, createMemo, Show } from 'solid-js'
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
  const stringStyle = createMemo(
    () =>
      (state.data?.theme &&
        Object.entries(renderClasses(state.data.theme))
          .map(
            ([className, content]) =>
              `.${cleanClassName(className)}${getModifier(className)} { ${content} }`
          )
          .join('')) ??
      ''
  )
  return (
    <style>
      <Show when={state.data?.theme}>{stringStyle()}</Show>
    </style>
  )
}

export default Style
