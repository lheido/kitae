import { ComponentData } from '@kitae/shared/types'
import { Component } from 'solid-js'

const availableComponents: Record<string, Component<{ data: ComponentData }>> = {}

export const registerComponent = (
  name: string,
  component: Component<{ data: ComponentData }>
): void => {
  availableComponents[name] = component
}

export const getComponent = (name: string): Component<{ data: ComponentData }> | undefined => {
  return availableComponents[name]
}
