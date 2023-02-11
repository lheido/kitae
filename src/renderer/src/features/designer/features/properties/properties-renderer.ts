import { ComponentData } from '@kitae/shared/types'

export type PropertyRenderer = (component: ComponentData, theme: string) => Record<string, string>

const availableComponents: PropertyRenderer[] = []

export const registerPropertyRenderer = (renderer: PropertyRenderer): void => {
  availableComponents.push(renderer)
}

export const renderProperties = (component: ComponentData, theme: string): object => {
  return availableComponents.reduce((acc, renderer) => {
    return { ...acc, ...renderer(component, theme) }
  }, {})
}
