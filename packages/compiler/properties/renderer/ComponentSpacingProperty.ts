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

const defaultValue = '0'

const _addClass = (
  modifier: string,
  type: SpacingType,
  key: string,
  value: string,
  classes: Record<string, boolean>
): void => {
  if (value === defaultValue && modifier === '') return
  classes[`${modifier}${type[0]}${key}-${value}`] = true
}

const dataToClass = (
  config: SpacingConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { type, data } = config
  const { left, top, right, bottom } = data
  const x = left === right ? left : undefined
  const y = top === bottom ? top : undefined
  if (x !== undefined && x === y) {
    _addClass(modifier, type, '', x, classes)
    return
  }
  if (x !== undefined) {
    _addClass(modifier, type, 'x', x, classes)
  } else {
    _addClass(modifier, type, 'l', left, classes)
    _addClass(modifier, type, 'r', right, classes)
  }
  if (y !== undefined) {
    _addClass(modifier, type, 'y', y, classes)
  } else {
    _addClass(modifier, type, 't', top, classes)
    _addClass(modifier, type, 'b', bottom, classes)
  }
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
    _renderClass(`p-${key}`, `padding: ${spacing[key]}`, result, filters)
    _renderClass(
      `px-${key}`,
      `padding-left: ${spacing[key]}; padding-right: ${spacing[key]}`,
      result,
      filters
    )
    _renderClass(
      `py-${key}`,
      `padding-top: ${spacing[key]}; padding-bottom: ${spacing[key]}`,
      result,
      filters
    )
    _renderClass(`pl-${key}`, `padding-left: ${spacing[key]}`, result, filters)
    _renderClass(`pr-${key}`, `padding-right: ${spacing[key]}`, result, filters)
    _renderClass(`pt-${key}`, `padding-top: ${spacing[key]}`, result, filters)
    _renderClass(`pb-${key}`, `padding-bottom: ${spacing[key]}`, result, filters)
    _renderClass(`ml-${key}`, `margin-left: ${spacing[key]}`, result, filters)
    _renderClass(`mr-${key}`, `margin-right: ${spacing[key]}`, result, filters)
    _renderClass(`mt-${key}`, `margin-top: ${spacing[key]}`, result, filters)
    _renderClass(`mb-${key}`, `margin-bottom: ${spacing[key]}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:p-${key}`, `padding: ${spacing[key]}`, result, filters)
      _renderClass(
        `${state.type}:px-${key}`,
        `padding-left: ${spacing[key]}; padding-right: ${spacing[key]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:py-${key}`,
        `padding-top: ${spacing[key]}; padding-bottom: ${spacing[key]}`,
        result,
        filters
      )
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
