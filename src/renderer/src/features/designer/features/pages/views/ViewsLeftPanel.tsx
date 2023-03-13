import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createSignal } from 'solid-js'
import AvailableComponentsManager from '../../data/manager/AvailableComponentsManager'
import PagesManager from '../../data/manager/PagesManager'
import StructureManager from '../../data/manager/StructureManager'

const ViewsLeftPanel: Component = () => {
  const [scrollTop, setScrollTop] = createSignal(0)
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      events={{ scroll: ({ elements }) => setScrollTop(elements().viewport.scrollTop) }}
      class="h-full"
    >
      <div class="p-2 grid grid-cols-1 gap-2">
        <h1 class="sr-only">Workspace views - left panel</h1>
        <PagesManager maxHeight={320} opened />
        <StructureManager scrollTop={scrollTop()} />
        <AvailableComponentsManager opened />
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default ViewsLeftPanel
