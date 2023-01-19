import { createStore } from 'solid-js/store'
import { RouterState } from './types'

export const [routerState, setRouterState] = createStore<RouterState>({
  history: [],
  routes: []
})

export const navigate = (name: string): void =>
  setRouterState((state) => {
    const definition = state.routes.find((r) => r.name === name)
    if (!definition) throw new Error(`Route definition ${name} not found`)
    if (state.history[state.history.length - 1] === definition) return state
    return {
      ...state,
      history: [...state.history, definition]
    }
  })

export const historyBack = (): void =>
  setRouterState((state) => {
    if (state.history.length === 1) return state
    return {
      ...state,
      history: state.history.slice(0, state.history.length - 1)
    }
  })
