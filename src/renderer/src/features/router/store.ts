import { createStore } from 'solid-js/store'
import { RouteDefinition, RouterState } from './types'

export const [routerState, setRouterState] = createStore<RouterState>({
  history: [],
  routes: [],
  get current(): RouteDefinition | undefined {
    return this.history[this.history.length - 1]
  }
})

export const navigate = async (name: string): Promise<void> => {
  const definition = routerState.routes.find((r) => r.name === name)
  if (!definition) throw new Error(`Route definition ${name} not found`)
  if (definition.resolve) await definition.resolve()
  if (routerState.history[routerState.history.length - 1] === definition) return void 0
  setRouterState('history', [...routerState.history, definition])
}

export const historyBack = (): void => {
  if (routerState.history.length === 1) return void 0
  setRouterState('history', routerState.history.slice(0, routerState.history.length - 1))
}
