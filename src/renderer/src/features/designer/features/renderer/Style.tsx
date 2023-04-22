/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderClasses } from '@kitae/compiler/properties'
import { Component, createMemo, Show } from 'solid-js'
import { useDesignerState } from '../state/designer.state'

const cleanClassName = (className: string): string =>
  className.replaceAll(':', '\\:').replaceAll('.', '\\.').replace('/', '\\/')

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
        Object.entries(renderClasses(state.data.theme, false))
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
