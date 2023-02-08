import { ComponentData } from '@kitae/shared/types'
import { useDesignerState } from '@renderer/features/designer'
import { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Children from '../Children'
import { getThemeEntryValue, useIsSelected } from '../utils'

type ContainerProps = { data: ComponentData }

const Container: Component<ContainerProps> = (props: ContainerProps) => {
  const isSelected = useIsSelected()
  const [state] = useDesignerState()
  return (
    <Dynamic
      component={props.data.config?.semantic ?? 'div'}
      id={props.data.id}
      classList={{ selected: isSelected(props.data.id) }}
      style={{
        'padding-left': getThemeEntryValue(
          state.data?.themes[0]?.spacing ?? [],
          props.data.config?.padding?.left ?? 0
        ),
        'padding-right': getThemeEntryValue(
          state.data?.themes[0]?.spacing ?? [],
          props.data.config?.padding?.right ?? 0
        ),
        'padding-top': getThemeEntryValue(
          state.data?.themes[0]?.spacing ?? [],
          props.data.config?.padding?.top ?? 0
        ),
        'padding-bottom': getThemeEntryValue(
          state.data?.themes[0]?.spacing ?? [],
          props.data.config?.padding?.bottom ?? 0
        )
      }}
    >
      {props.data?.children?.map((child) => (
        <Children data={child} />
      ))}
    </Dynamic>
  )
}

export default Container
