import { ComponentData } from '@kitae/shared/types'
import { registerComponent } from '@renderer/features/designer/available-component'
import { renderProperties } from '@renderer/features/properties'
import { getConfig } from '@renderer/features/utils/get-config.util'
import DOMPurify from 'dompurify'
import { Component, createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useIsSelected } from '../../renderer/helpers'

type TextProps = { data: ComponentData }

const Text: Component<TextProps> = (props: TextProps) => {
  const isSelected = useIsSelected()
  const style = createMemo(() => renderProperties(JSON.parse(JSON.stringify(props.data))))
  return (
    <Dynamic
      component={(getConfig(props.data.config!, 'semantic')?.data as string) ?? 'span'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id), ...style().class }}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={DOMPurify.sanitize(
        (getConfig(props.data.config!, 'text')?.data as string)?.replace(
          /(?:\r\n|\r|\n)/g,
          '<br>'
        ) ?? ''
      )}
    />
  )
}

export default Text

registerComponent('text', Text)
