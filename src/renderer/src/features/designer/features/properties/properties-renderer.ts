import { ComponentData, WorkspaceTheme } from '@kitae/shared/types'

export interface PropertyRendererResult {
  class: Record<string, boolean>
}

export type PropertyRenderer = (component: ComponentData) => PropertyRendererResult
export type ClassRenderer = (theme: WorkspaceTheme) => Record<string, string>

const availableComponents: PropertyRenderer[] = []
const availableClasses: ClassRenderer[] = []

export const registerPropertyRenderer = (renderer: PropertyRenderer): void => {
  availableComponents.push(renderer)
}

export const registerClassRenderer = (renderer: ClassRenderer): void => {
  availableClasses.push(renderer)
}

export const renderProperties = (component: ComponentData): PropertyRendererResult => {
  return availableComponents.reduce((acc, renderer) => {
    const result = renderer(component)
    return { class: { ...acc.class, ...result.class } }
  }, {} as PropertyRendererResult)
}

export const renderClasses = (theme: WorkspaceTheme): Record<string, string> => {
  return availableClasses.reduce((acc, renderer) => ({ ...acc, ...renderer(theme) }), {})
}
