import { Path } from '@kitae/shared/types'
import { draggable } from '@renderer/features/drag-n-drop'
import { Component, ComponentProps, JSX, createMemo } from 'solid-js'
import { useDesignerState } from '../../../state/designer.state'
import ComponentConfigLabel from './ComponentConfigLabel'
import ComponentConfigRemove from './ComponentConfigRemove'

!!draggable && false

interface ComponentPropertyProps<U extends JSX.Element = JSX.Element>
  extends ComponentProps<'section'> {
  index?: number
  path?: Path
  label: string
  headerSlot?: JSX.Element
  children: () => U
}

const ComponentProperty: Component<ComponentPropertyProps> = (props: ComponentPropertyProps) => {
  const [state] = useDesignerState()
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  return (
    <section class="bg-base-200 rounded-lg relative">
      <header class="pl-2 flex items-center">
        <ComponentConfigLabel path={path()}>{props.label}</ComponentConfigLabel>
        {props.headerSlot}
        <ComponentConfigRemove path={path()} />
      </header>
      {props.children()}
    </section>
  )
}

export default ComponentProperty
