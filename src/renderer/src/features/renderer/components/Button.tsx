import { ComponentData } from '@kitae/shared/types'
import { Component } from 'solid-js'
import Children from '../Children'

type ButtonProps = { data: ComponentData }

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  return (
    <button id={props.data.id}>
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </button>
  )
}

export default Button
