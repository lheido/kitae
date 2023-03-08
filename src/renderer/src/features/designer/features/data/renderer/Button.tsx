import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component, createMemo } from 'solid-js'
import { renderProperties } from '../../properties/properties-renderer'
import Children from '../../renderer/Children'
import { useIsSelected } from '../../renderer/helpers'
import { useDesignerState } from '../../state/designer.state'

type ButtonProps = { data: ComponentData }

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  const [state] = useDesignerState()
  const isSelected = useIsSelected()
  const style = createMemo(() => renderProperties(JSON.parse(JSON.stringify(props.data))))
  return (
    <button
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id), ...style().class }}
    >
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </button>
  )
}

export default Button

registerComponent('button', Button)
