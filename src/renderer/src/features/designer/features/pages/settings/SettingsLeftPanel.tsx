import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createSignal } from 'solid-js'

const SettingsLeftPanel: Component = () => {
  const [scrollTop, setScrollTop] = createSignal(0)
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      events={{ scroll: ({ elements }) => setScrollTop(elements().viewport.scrollTop) }}
      class="h-full"
    >
      <div class="grid p-2 grid-cols-1 gap-2">
        <h1 class="sr-only">Workspace Settings</h1>
        <p>TODO: settings</p>
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default SettingsLeftPanel
