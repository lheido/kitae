import { ComponentData } from '@kitae/shared/types'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'

type TextProps = { data: ComponentData }

const Text: Component<TextProps> = (props: TextProps) => {
  return (
    <Dynamic component={props.data.config?.semantic ?? 'span'} id={props.data.id}>
      {props.data.config.text}
    </Dynamic>
  )
}

export default Text
