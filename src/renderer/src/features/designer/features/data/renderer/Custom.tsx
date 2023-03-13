import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component, createMemo, For, JSX } from 'solid-js'
import Children from '../../renderer/Children'
import { useDesignerState } from '../../state/designer.state'

type CustomProps = { data: ComponentData }

const Custom: Component<CustomProps> = (props: CustomProps) => {
  const [state] = useDesignerState()
  const getCustomComponentData = createMemo(() => {
    return state.data?.components.find((c) => c.id === props.data.ref)
  })
  return (
    <For each={getCustomComponentData()?.children}>
      {(child): JSX.Element => <Children data={child} />}
    </For>
  )
}

export default Custom

registerComponent('custom', Custom)
