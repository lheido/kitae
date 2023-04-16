/* eslint-disable @typescript-eslint/no-explicit-any */
import { Path } from '@kitae/shared/types'
import { Draggable, draggable } from '@renderer/features/drag-n-drop'
import { ComponentProps, JSX, createEffect, createMemo, splitProps, untrack } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { twMerge } from 'tailwind-merge'
import { useDesignerState } from '../../../state/designer.state'

!!draggable && false

interface ConfigLabelComponentProps extends ComponentProps<'span'> {
  tag?: string
  index?: number
  path?: Path
}

export type ConfigLabelProxyComponent<T> = (props: T & ConfigLabelComponentProps) => JSX.Element
export type ConfigLabelProxy = typeof ComponentConfigLabelComponent & {
  // <ComponentConfigLabel.h1 />
  [K in keyof JSX.IntrinsicElements]: ConfigLabelProxyComponent<JSX.IntrinsicElements[K]>
}

export const ComponentConfigLabelComponent = (props: ConfigLabelComponentProps): any => {
  const [local, classes, others] = splitProps(props, ['tag'], ['class'])
  const [state] = useDesignerState()
  let eltRef!: HTMLElement
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const draggableOption = createMemo<Draggable>(() => {
    return {
      format: 'kitae/move-config',
      effect: 'move',
      id: crypto.randomUUID(),
      path: path(),
      enabled: true
    }
  })
  createEffect(() => draggable(eltRef, draggableOption))
  return (
    <Dynamic
      ref={eltRef}
      component={untrack(() => local.tag || 'h1')}
      {...others}
      class={twMerge('flex-1 cursor-move select-none', classes.class)}
    />
  )
}

const ComponentConfigLabel = new Proxy(ComponentConfigLabelComponent, {
  get:
    (_, tag: string): ConfigLabelProxyComponent<any> =>
    (props: any) => {
      return <ComponentConfigLabelComponent {...props} tag={tag} />
    }
}) as ConfigLabelProxy

export default ComponentConfigLabel
