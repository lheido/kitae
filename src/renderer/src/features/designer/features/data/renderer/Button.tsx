import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component } from 'solid-js'
import Children from '../../renderer/Children'
import { useIsSelected } from '../../renderer/helpers'

type ButtonProps = { data: ComponentData }

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  const isSelected = useIsSelected()
  return (
    <button id={props.data.id} classList={{ selected: isSelected(props.data.id) }}>
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </button>
  )
}

export default Button

registerComponent('button', Button)
