import { ComponentData } from '@kitae/shared/types'
import Icon from '@renderer/components/Icon'
import { componentTypeIconMap } from '@renderer/features/designer/icon-map'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component } from 'solid-js'
import AvailablePropertiesManager from '../../data/manager/AvailablePropertiesManager'
import PropertiesManager from '../../data/manager/PropertiesManager'
import { useDesignerState } from '../../state/designer.state'
import { walker } from '../../utils/walker.util'

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
      <div class="min-h-full flex flex-col gap-2">
        <div class="flex items-center gap-2 pb-1 sticky top-0 z-20 bg-base-100">
          <Icon icon={isPageConfig() ? 'pages' : componentTypeIconMap[type()]} />
          <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">
            {isPageConfig() ? 'Edit Page' : 'Edit Component'}
          </h1>
        </div>
        <PropertiesManager />
        <AvailablePropertiesManager types={[]} />
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default ViewsRightPanel
