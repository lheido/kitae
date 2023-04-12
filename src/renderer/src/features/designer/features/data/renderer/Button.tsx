import { renderProperties } from '@kitae/compiler/properties'
import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component, createMemo, For, JSX } from 'solid-js'
import Children from '../../renderer/Children'
import { useIsSelected } from '../../renderer/helpers'

type ButtonProps = { data: ComponentData }

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  const isSelected = useIsSelected()
  const style = createMemo(() => renderProperties(JSON.parse(JSON.stringify(props.data))))
  return (
    <button
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id), ...style().class }}
    >
      <For each={props.data?.children}>{(child): JSX.Element => <Children data={child} />}</For>
    </button>
  )
}

export default Button

registerComponent('button', Button)
