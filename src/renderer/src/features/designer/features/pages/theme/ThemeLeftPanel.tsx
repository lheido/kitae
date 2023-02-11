import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createSignal } from 'solid-js'
import ColorsManager from '../../data/manager/ColorsManager'
import FontFamilyManager from '../../data/manager/FontFamilyManager'
import ThemeManager from '../../data/manager/ThemeManager'

const ThemeLeftPanel: Component = () => {
  const [scrollTop, setScrollTop] = createSignal(0)
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      events={{ scroll: ({ elements }) => setScrollTop(elements().viewport.scrollTop) }}
      class="h-full p-2"
    >
      <div class="grid grid-cols-1 gap-2">
        <h1 class="sr-only">Workspace Theme - left panel</h1>
        <ThemeManager maxHeight={320} opened />
        <ColorsManager scrollTop={scrollTop()} scrollOffset={130} />
        <FontFamilyManager scrollTop={scrollTop()} scrollOffset={1000} />
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default ThemeLeftPanel
