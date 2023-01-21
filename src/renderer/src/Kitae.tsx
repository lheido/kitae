import type { Component } from 'solid-js'
import { api } from './features/api'
import Routes from './features/router/Routes'
import { initialRoute, routes } from './kitae.routing'

const App: Component = () => {
  return (
    <>
      <header
        style={{
          height: `${api.windowArgs ? api.windowArgs['title-bar-overlay-height'] : 36}px`,
          '-webkit-app-region': 'drag'
        }}
        class="box-content bg-base-100 text-base-content flex items-center gap-4 pl-2 pr-36 select-none"
      >
        <p class="text-ellipsis whitespace-nowrap flex-1 overflow-hidden">Kitae</p>
      </header>
      <main class="flex-1 flex justify-center items-center w-full">
        <Routes routes={routes} initialRoute={initialRoute} />
      </main>
    </>
  )
}

export default App
