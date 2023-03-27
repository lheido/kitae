import { Component } from 'solid-js'

export interface RouteDefinition {
  name: string
  component: Component
  resolve?: () => Promise<void>
}

export interface RouterState {
  history: RouteDefinition[]
  routes: RouteDefinition[]
  readonly current: RouteDefinition | undefined
}
