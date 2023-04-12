import { ComponentConfig, ComponentData, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'

type Keys = 'tl' | 'tr' | 'bl' | 'br'
interface RoundedConfig extends ComponentConfig {
  type: 'rounded'
  data: Record<Keys, string>
}

const dataToClass = (
  config: RoundedConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { type, data } = config
  Object.entries(data).forEach(([key, value]) => {
    if (value === '0' && modifier === '') return
    classes[`${modifier}${type}-${key}-${value}`] = true
  })
}

const renderProperties = (component: ComponentData): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  component.config
    ?.filter((config) => ['rounded'].includes(config.type))
    .forEach((config) => dataToClass(config as RoundedConfig, result.class))
  component.config
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      ;(config.data as { config: ComponentConfig[] })?.config
        ?.filter((c) => ['rounded'].includes(c.type))
        .forEach((c) => dataToClass(c as RoundedConfig, result.class, `${config.type}:`))
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme): Record<string, string> => {
  const { rounded } = theme
  const result: Record<string, string> = {}
  Object.keys(rounded).forEach((key) => {
    result[`rounded-tl-${key}`] = `border-top-left-radius: ${rounded[key]}`
    result[`rounded-tr-${key}`] = `border-top-right-radius: ${rounded[key]}`
    result[`rounded-bl-${key}`] = `border-bottom-left-radius: ${rounded[key]}`
    result[`rounded-br-${key}`] = `border-bottom-right-radius: ${rounded[key]}`
    defaultStateProperties.forEach((state) => {
      result[`${state.type}:rounded-tl-${key}`] = `border-top-left-radius: ${rounded[key]}`
      result[`${state.type}:rounded-tr-${key}`] = `border-top-right-radius: ${rounded[key]}`
      result[`${state.type}:rounded-bl-${key}`] = `border-bottom-left-radius: ${rounded[key]}`
      result[`${state.type}:rounded-br-${key}`] = `border-bottom-right-radius: ${rounded[key]}`
    })
  })
  return result
}

registerClassRenderer(renderClass)
