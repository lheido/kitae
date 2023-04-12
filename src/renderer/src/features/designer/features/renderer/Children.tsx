import { ComponentData } from 'packages/shared/types'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { getComponent } from '../../available-component'

export interface ChildrenProps {
  data: ComponentData
}

const Children: Component<ChildrenProps> = (props: ChildrenProps) => {
  return (
    <Dynamic
      component={getComponent(props.data?.type === 'page' ? 'container' : props.data?.type)}
      data={props.data}
    />
  )
}

export default Children
