import { Component, Show } from 'solid-js'
import iconUrl from './assets/icon.png?url'
import WorkspacesMenu from './components/WorkspacesMenu'
import { api } from './features/api'
import ContextMenu from './features/context-menu/ContextMenu'
import DesignerToolbar from './features/designer/components/DesignerToolbar'
import { WorkspaceDataProvider } from './features/designer/features/state/WorkspaceDataProvider'
import { WorkspaceDataHsitoryHandlers } from './features/designer/history-handlers'
import { registerHistoryChangeHandler } from './features/history'
import { ShortcutProvider } from './features/keyboard'
import { routerState } from './features/router'
import Routes from './features/router/Routes'
import { workspacesState } from './features/workspaces'
import { routes } from './kitae.routing'

registerHistoryChangeHandler(WorkspaceDataHsitoryHandlers)

const App: Component = () => {
  return (
    <ShortcutProvider>
      <WorkspaceDataProvider>
        <header
          style={{
            height: `${api.windowArgs ? api.windowArgs['title-bar-overlay-height'] : 36}px`,
            '-webkit-app-region': 'drag'
          }}
          class="box-content bg-base-100 text-base-content flex items-center gap-5 pl-5 pr-36 select-none relative z-10 drop-shadow-lg"
        >
          <img class="h-auto w-6" src={iconUrl} alt="Kitae logo" />
          <Show
            when={routerState.current?.name === 'designer' && workspacesState.current}
            fallback={<p>Kitae</p>}
          >
            <WorkspacesMenu />
            <DesignerToolbar />
          </Show>
        </header>
        <main
          class="flex-1 flex justify-center items-center w-full"
          style={{
            height: `calc(100% - ${
              api.windowArgs ? api.windowArgs['title-bar-overlay-height'] : 36
            }px)`
          }}
        >
          <Routes routes={routes} initialRoute={routes[0]} />
        </main>
        <ContextMenu />
      </WorkspaceDataProvider>
    </ShortcutProvider>
  )
}

export default App
