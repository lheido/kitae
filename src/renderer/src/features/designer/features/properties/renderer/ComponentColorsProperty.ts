import { ComponentConfig, ComponentData, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '@renderer/features/designer/default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'

type ColorType = 'backgroundColor' | 'color'
interface ColorConfig extends ComponentConfig {
  type: ColorType
  data: string
}

const colorTypeMap = {
  backgroundColor: 'bg',
  color: 'text'
}

const dataToClass = (
  config: ColorConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { type, data } = config
  if (data) {
    classes[`${modifier}${colorTypeMap[type]}-${data}`] = true
  }
}

const renderProperties = (component: ComponentData): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  component.config
    ?.filter((config) => ['backgroundColor', 'color'].includes(config.type))
    .forEach((config) => dataToClass(config as ColorConfig, result.class))
  component.config
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      ;(config.data as { config: ComponentConfig[] })?.config
        ?.filter((c) => ['backgroundColor', 'color'].includes(c.type))
        .forEach((c) => dataToClass(c as ColorConfig, result.class, `${config.type}:`))
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme): Record<string, string> => {
  const { colors } = theme
  const result: Record<string, string> = {}
  Object.keys(colors).forEach((key) => {
    result[`bg-${key}`] = `background-color: ${colors[key]}`
    result[`text-${key}`] = `color: ${colors[key]}`
    result[`hover:bg-${key}`] = `background-color: ${colors[key]}`
    result[`hover:text-${key}`] = `color: ${colors[key]}`
    defaultStateProperties.forEach((state) => {
      result[`${state.type}:bg-${key}`] = `background-color: ${colors[key]}`
      result[`${state.type}:text-${key}`] = `color: ${colors[key]}`
    })
  })
  return result
}

registerClassRenderer(renderClass)
