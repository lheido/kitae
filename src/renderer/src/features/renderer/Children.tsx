import { ComponentData } from 'packages/shared/types'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { components } from './components'

export interface ChildrenProps {
  data: ComponentData
}

const Children: Component<ChildrenProps> = (props: ChildrenProps) => {
  return <Dynamic component={components[props.data.type]} data={props.data} />
}

export default Children
