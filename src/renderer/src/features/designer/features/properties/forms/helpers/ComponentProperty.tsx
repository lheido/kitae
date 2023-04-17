import { Path } from '@kitae/shared/types'
import { draggable } from '@renderer/features/drag-n-drop'
import { Component, ComponentProps, JSX } from 'solid-js'
import ComponentConfigLabel from './ComponentConfigLabel'
import ComponentConfigRemove from './ComponentConfigRemove'

!!draggable && false

interface ComponentPropertyProps extends ComponentProps<'section'> {
  index?: number
  path?: Path
  label: string
  headerSlot?: JSX.Element
}

const ComponentProperty: Component<ComponentPropertyProps> = (props: ComponentPropertyProps) => {
  return (
    <section class="bg-base-200 rounded-lg relative">
      <header class="px-2 flex items-center">
        <ComponentConfigLabel path={props.path}>{props.label}</ComponentConfigLabel>
        {props.headerSlot}
        <ComponentConfigRemove path={props.path} />
      </header>
      {props.children}
    </section>
  )
}

export default ComponentProperty
