import { Component, onMount, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { routerState, setRouterState } from './store'
import { RouteDefinition } from './types'

interface RoutesProps {
  routes: RouteDefinition[]
  initialRoute: RouteDefinition
}

const Routes: Component<RoutesProps> = (props: RoutesProps) => {
  onMount(() => {
    setRouterState({ history: [props.initialRoute], routes: props.routes })
  })
  return (
    <Show when={routerState.history.length > 0}>
      <Dynamic component={routerState.history[routerState.history.length - 1]?.component} />
    </Show>
  )
}

export default Routes
