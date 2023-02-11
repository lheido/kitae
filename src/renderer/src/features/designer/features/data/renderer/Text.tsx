import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import DOMPurify from 'dompurify'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useIsSelected } from '../../renderer/helpers'

type TextProps = { data: ComponentData }

const Text: Component<TextProps> = (props: TextProps) => {
  const isSelected = useIsSelected()
  return (
    <Dynamic
      component={props.data.config?.semantic ?? 'span'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id) }}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={DOMPurify.sanitize(
        props.data.config.text.replace(/(?:\r\n|\r|\n)/g, '<br>') ?? ''
      )}
    />
  )
}

export default Text

registerComponent('text', Text)
