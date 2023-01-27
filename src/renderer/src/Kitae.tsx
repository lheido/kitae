import { Component, Show } from 'solid-js'
import WorkspacesMenu from './components/WorkspacesMenu'
import { api } from './features/api'
import DesignerToolbarActions from './features/designer/components/DesignerToolbarActions'
import { WorkspaceDataProvider } from './features/designer/contexts/WorkspaceDataProvider'
import { routerState } from './features/router'
import Routes from './features/router/Routes'
import { workspacesState } from './features/workspaces'
import { routes } from './kitae.routing'

const App: Component = () => {
  return (
    <WorkspaceDataProvider>
      <header
        style={{
          height: `${api.windowArgs ? api.windowArgs['title-bar-overlay-height'] : 36}px`,
          '-webkit-app-region': 'drag'
        }}
        class="box-content bg-base-100 text-base-content flex items-center gap-4 pl-2 pr-36 select-none relative z-10 drop-shadow-lg"
      >
        <p class="text-ellipsis whitespace-nowrap overflow-hidden">Kitae</p>
        <Show when={routerState.current?.name === 'designer' && workspacesState.current}>
          <WorkspacesMenu />

          <DesignerToolbarActions />
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
    </WorkspaceDataProvider>
  )
}

export default App
