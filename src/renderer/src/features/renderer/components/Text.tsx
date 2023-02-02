import { ComponentData } from '@kitae/shared/types'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useIsSelected } from '../utils'

type TextProps = { data: ComponentData }

const Text: Component<TextProps> = (props: TextProps) => {
  const isSelected = useIsSelected()
  return (
    <Dynamic
      component={props.data.config?.semantic ?? 'span'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id) }}
    >
      {props.data.config.text}
    </Dynamic>
  )
}

export default Text
