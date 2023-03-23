import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { Component, createMemo, For, JSX } from 'solid-js'
import Children from '../../renderer/Children'
import { useDesignerState } from '../../state/designer.state'
import { replaceChildren } from '../../utils/children.util'
import { replaceSlots } from '../../utils/slot.util'

type CustomProps = { data: ComponentData }

const Custom: Component<CustomProps> = (props: CustomProps) => {
  const [state] = useDesignerState()
  const getCustomComponentData = createMemo(() => {
    return state.data?.components.find((c) => c.id === props.data.ref)
  })
  // Replace custom component 'slot' and 'children' with current data.
  const getChildren = createMemo(() => {
    const data = JSON.parse(JSON.stringify(props.data)) as ComponentData
    const originalTree = JSON.parse(JSON.stringify(getCustomComponentData())) as ComponentData
    replaceChildren(data, originalTree)
    const tree = replaceSlots(data, originalTree)
    return tree.children ?? []
  })
  return <For each={getChildren()}>{(child): JSX.Element => <Children data={child} />}</For>
}

export default Custom

registerComponent('custom', Custom)
