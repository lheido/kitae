import { renderProperties } from '@kitae/compiler/properties'
import { ComponentData } from '@kitae/shared/types'
import { getComponentPath, getConfig, walker } from '@kitae/shared/utils'
import { registerComponent } from '@renderer/features/designer/available-component'
import { createFormControl } from '@renderer/features/form'
import DOMPurify from 'dompurify'
import { Component, createEffect, createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { makeUpdateTextConfigPropertyChange } from '../../history/property.events'
import { useIsSelected } from '../../renderer/helpers'
import { useDesignerState } from '../../state/designer.state'

type TextProps = { data: ComponentData }
type ContentEditableInputEvent = InputEvent & {
  target: ElementContentEditable & HTMLElement
}

const Text: Component<TextProps> = (props: TextProps) => {
  let ref!: HTMLElement
  const [state] = useDesignerState()
  const isSelected = useIsSelected()
  const style = createMemo(() =>
    renderProperties(JSON.parse(JSON.stringify(props.data.config ?? [])))
  )
  const control = createFormControl({ value: '' })
  const config = createMemo(() => getConfig(props.data.config!, 'text'))
  createEffect((prev) => {
    const value = (config()?.data as string) ?? ''
    if (!control.touched && prev !== value) {
      control.patchValue(value, false)
    }
    return value
  })
  const content = createMemo(() => {
    let text = control.value as string
    text = text?.replace(/(?:\r\n|\r|\n)/g, '<br>')
    return DOMPurify.sanitize(text)
  })
  createEffect(() => {
    if (!control.touched && ref) {
      ref.innerHTML = content()
    }
  })
  createEffect(() => {
    const semanticConfig = props.data.config?.find((c) => c.type === 'semantic')
    if (semanticConfig?.data && ref && !control.touched) {
      ref.innerHTML = content()
    } else if (ref && !control.touched) {
      ref.innerHTML = content()
    }
  })
  const submitHandler = (): void => {
    if (control.touched && control.valid) {
      const rootTree = walker<ComponentData>(state.data, state.current.slice(0, 2))
      const p = getComponentPath(props.data.id, rootTree!)
      const i = props.data.config?.findIndex((c) => c.type === 'text')
      const path = [...state.current.slice(0, 2), ...p!, 'config', i!]
      const previous = config()?.data as string
      makeUpdateTextConfigPropertyChange({
        path,
        changes: [previous, { text: control.value as string }]
      })
      control.set('touched', false)
    }
  }
  return (
    <Dynamic
      ref={ref}
      component={(getConfig(props.data.config!, 'semantic')?.data as string) ?? 'span'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id), ...style().class }}
      contenteditable
      onInput={(e: ContentEditableInputEvent): void => {
        const text = e.target.innerText
        control.patchValue(text, true)
      }}
      onBlur={submitHandler}
    />
  )
}

export default Text

registerComponent('text', Text)
