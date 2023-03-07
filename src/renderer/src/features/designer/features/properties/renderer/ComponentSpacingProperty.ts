import { ComponentConfig, ComponentData, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '@renderer/features/designer/default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'

type SpacingKeys = 'left' | 'top' | 'right' | 'bottom'
type SpacingType = 'padding' | 'margin'
interface SpacingConfig extends ComponentConfig {
  type: SpacingType
  data: Record<SpacingKeys, string>
}

const dataToClass = (
  config: SpacingConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { type, data } = config
  Object.entries(data).forEach(([key, value]) => {
    if (value === '0' && modifier === '') return
    classes[`${modifier}${type[0]}${key[0]}-${value}`] = true
  })
}

const renderProperties = (component: ComponentData): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  component.config
    ?.filter((config) => ['padding', 'margin'].includes(config.type))
    .forEach((config) => dataToClass(config as SpacingConfig, result.class))
  component.config
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      ;(config.data as { config: ComponentConfig[] })?.config
        ?.filter((c) => ['padding', 'margin'].includes(c.type))
        .forEach((c) => dataToClass(c as SpacingConfig, result.class, `${config.type}:`))
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme): Record<string, string> => {
  const { spacing } = theme
  const result: Record<string, string> = {}
  Object.keys(spacing).forEach((key) => {
    result[`pl-${key}`] = `padding-left: ${spacing[key]}`
    result[`pr-${key}`] = `padding-right: ${spacing[key]}`
    result[`pt-${key}`] = `padding-top: ${spacing[key]}`
    result[`pb-${key}`] = `padding-bottom: ${spacing[key]}`
    result[`ml-${key}`] = `margin-left: ${spacing[key]}`
    result[`mr-${key}`] = `margin-right: ${spacing[key]}`
    result[`mt-${key}`] = `margin-top: ${spacing[key]}`
    result[`mb-${key}`] = `margin-bottom: ${spacing[key]}`
    result[`hover:pl-${key}`] = `padding-left: ${spacing[key]}`
    result[`hover:pr-${key}`] = `padding-right: ${spacing[key]}`
    result[`hover:pt-${key}`] = `padding-top: ${spacing[key]}`
    result[`hover:pb-${key}`] = `padding-bottom: ${spacing[key]}`
    result[`hover:ml-${key}`] = `margin-left: ${spacing[key]}`
    result[`hover:mr-${key}`] = `margin-right: ${spacing[key]}`
    result[`hover:mt-${key}`] = `margin-top: ${spacing[key]}`
    result[`hover:mb-${key}`] = `margin-bottom: ${spacing[key]}`
  })
  return result
}

registerClassRenderer(renderClass)
