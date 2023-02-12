import { ComponentData } from '@kitae/shared/types'
import Icon from '@renderer/components/Icon'
import { componentTypeIconMap } from '@renderer/features/designer/component-icon-map'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, JSX, Show } from 'solid-js'
import ComponentColorsProperty from '../../properties/forms/ComponentColorsProperty'
import ComponentSpacingProperty from '../../properties/forms/ComponentSpacingProperty'
import ComponentTextProperty from '../../properties/forms/ComponentTextProperty'
import NameProperty from '../../properties/forms/NameProperty'
import { useDesignerState } from '../../state/designer.state'
import { walker } from '../../utils/walker.util'

const componentProperties: Record<string, { properties: (isPage: boolean) => JSX.Element }> = {
  container: {
    properties: (isPage) => (
      <>
        <NameProperty />
        <ComponentSpacingProperty prefix="padding" />
        <Show when={!isPage}>
          <ComponentSpacingProperty prefix="margin" />
        </Show>
        <ComponentColorsProperty maxHeight={320} prefix="backgroundColor" />
        <ComponentColorsProperty maxHeight={320} prefix="color" />
      </>
    )
  },
  button: {
    properties: () => (
      <>
        <NameProperty />
        <ComponentSpacingProperty prefix="padding" />
        <ComponentSpacingProperty prefix="margin" />
        <ComponentColorsProperty maxHeight={320} prefix="backgroundColor" />
        <ComponentColorsProperty maxHeight={320} prefix="color" />
      </>
    )
  },
  text: {
    properties: () => (
      <>
        <ComponentTextProperty />
      </>
    )
  }
}

const ViewsRightPanel: Component = () => {
  const [state] = useDesignerState()
  const type = (): string => (walker(state.data, state.current) as ComponentData)?.type ?? ''
  const isPageConfig = (): boolean => state.current.length === 2
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      class="h-full px-2"
    >
      <div class="flex flex-col gap-2 h-[200vh]">
        <div class="flex items-center gap-2 pb-1 sticky top-0 z-20 bg-base-100">
          <Icon icon={isPageConfig() ? 'pages' : componentTypeIconMap[type()]} />
          <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">
            {isPageConfig() ? 'Edit Page' : 'Edit Component'}
          </h1>
        </div>
        <Show when={type() !== ''}>{componentProperties[type()].properties(isPageConfig())}</Show>
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default ViewsRightPanel
