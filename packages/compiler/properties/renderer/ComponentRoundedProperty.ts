import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

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

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['rounded'].includes(config.type))
    .forEach((config) => dataToClass(config as RoundedConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps((config.data as { config: RoundedConfig[] })?.config, result, `${config.type}:`)
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const { rounded } = theme
  const result: Record<string, string> = {}
  Object.keys(rounded).forEach((key) => {
    _renderClass(`rounded-tl-${key}`, `border-top-left-radius: ${rounded[key]}`, result, filters)
    _renderClass(`rounded-tr-${key}`, `border-top-right-radius: ${rounded[key]}`, result, filters)
    _renderClass(`rounded-bl-${key}`, `border-bottom-left-radius: ${rounded[key]}`, result, filters)
    _renderClass(
      `rounded-br-${key}`,
      `border-bottom-right-radius: ${rounded[key]}`,
      result,
      filters
    )
    defaultStateProperties.forEach((state) => {
      _renderClass(
        `${state.type}:rounded-tl-${key}`,
        `border-top-left-radius: ${rounded[key]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-tr-${key}`,
        `border-top-right-radius: ${rounded[key]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-bl-${key}`,
        `border-bottom-left-radius: ${rounded[key]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-br-${key}`,
        `border-bottom-right-radius: ${rounded[key]}`,
        result,
        filters
      )
    })
  })
  return result
}

registerClassRenderer(renderClass)
