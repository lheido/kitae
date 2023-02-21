import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component, createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { renderProperties } from '../../properties/properties-renderer'
import Children from '../../renderer/Children'
import { useIsSelected } from '../../renderer/helpers'
import { useDesignerState } from '../../state/designer.state'
import { getConfig } from '../../utils/get-config.util'

type ContainerProps = { data: ComponentData }

const Container: Component<ContainerProps> = (props: ContainerProps) => {
  const isSelected = useIsSelected()
  const [state] = useDesignerState()
  const style = createMemo(() =>
    renderProperties(
      JSON.parse(JSON.stringify(props.data)),
      JSON.parse(JSON.stringify(getConfig(props.data.config!, 'theme')?.data ?? state.theme))
    )
  )
  return (
    <Dynamic
      component={(getConfig(props.data.config!, 'semantic')?.data as string) ?? 'div'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id) }}
      style={style()}
    >
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </Dynamic>
  )
}

export default Container

registerComponent('container', Container)
