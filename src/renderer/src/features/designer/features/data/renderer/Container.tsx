import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { renderProperties } from '@renderer/features/properties'
import { getConfig } from '@renderer/features/utils/get-config.util'
import { Component, createMemo, For, JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Children from '../../renderer/Children'
import { useIsSelected } from '../../renderer/helpers'

type ContainerProps = { data: ComponentData }

const Container: Component<ContainerProps> = (props: ContainerProps) => {
  const isSelected = useIsSelected()
  const style = createMemo(() => renderProperties(JSON.parse(JSON.stringify(props.data))))
  return (
    <Dynamic
      component={(getConfig(props.data.config!, 'semantic')?.data as string) ?? 'div'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id), ...style().class }}
    >
      <For each={props.data?.children}>{(child): JSX.Element => <Children data={child} />}</For>
    </Dynamic>
  )
}

export default Container

registerComponent('container', Container)
