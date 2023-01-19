import type { Component } from 'solid-js'
import Icon from './components/Icon'
import { api } from './features/api'
import Routes from './features/router/Routes'
import { initialRoute, routes } from './kitae.routing'

const App: Component = () => {
  return (
    <>
      <header
        style={{
          height: `${api.windowArgs['title-bar-overlay-height'] ?? 36}px`,
          '-webkit-app-region': 'drag'
        }}
        class="box-content bg-base-100 text-base-content border-b border-primary flex items-center gap-4 pl-2 pr-36 select-none"
      >
        <Icon icon="more" />
        <p class="text-ellipsis whitespace-nowrap flex-1 overflow-hidden">Kitae</p>
      </header>
      <main>
        <Routes routes={routes} initialRoute={initialRoute} />
      </main>
    </>
  )
}

export default App
