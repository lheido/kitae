import { ComponentData } from '@kitae/shared/types'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Children from '../Children'

type ContainerProps = { data: ComponentData }

const Container: Component<ContainerProps> = (props: ContainerProps) => {
  return (
    <Dynamic component={props.data.config?.semantic ?? 'div'} id={props.data.id}>
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </Dynamic>
  )
}

export default Container
