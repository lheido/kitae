import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

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

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['padding', 'margin'].includes(config.type))
    .forEach((config) => dataToClass(config as SpacingConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps((config.data as { config: SpacingConfig[] })?.config, result, `${config.type}:`)
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const { spacing } = theme
  const result: Record<string, string> = {}
  Object.keys(spacing).forEach((key) => {
    _renderClass(`pl-${key}`, `padding-left: ${spacing[key]}`, result, filters)
    _renderClass(`pr-${key}`, `padding-right: ${spacing[key]}`, result, filters)
    _renderClass(`pt-${key}`, `padding-top: ${spacing[key]}`, result, filters)
    _renderClass(`pb-${key}`, `padding-bottom: ${spacing[key]}`, result, filters)
    _renderClass(`ml-${key}`, `margin-left: ${spacing[key]}`, result, filters)
    _renderClass(`mr-${key}`, `margin-right: ${spacing[key]}`, result, filters)
    _renderClass(`mt-${key}`, `margin-top: ${spacing[key]}`, result, filters)
    _renderClass(`mb-${key}`, `margin-bottom: ${spacing[key]}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:pl-${key}`, `padding-left: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:pr-${key}`, `padding-right: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:pt-${key}`, `padding-top: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:pb-${key}`, `padding-bottom: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:ml-${key}`, `margin-left: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:mr-${key}`, `margin-right: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:mt-${key}`, `margin-top: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:mb-${key}`, `margin-bottom: ${spacing[key]}`, result, filters)
    })
  })
  return result
}

registerClassRenderer(renderClass)
