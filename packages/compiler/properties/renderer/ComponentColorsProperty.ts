import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

type ColorType = 'backgroundColor' | 'color'
interface ColorConfig extends ComponentConfig {
  type: ColorType
  data: string
}

const colorTypeMap: Record<ColorType, string> = {
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

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['backgroundColor', 'color'].includes(config.type))
    .forEach((config) => dataToClass(config as ColorConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps(
        (config.data as { config: ComponentConfig[] })?.config,
        result,
        `${config.type}:`
      )
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const { colors } = theme
  const result: Record<string, string> = {}
  Object.keys(colors).forEach((key) => {
    _renderClass(`bg-${key}`, `background-color: ${colors[key]}`, result, filters)
    _renderClass(`text-${key}`, `color: ${colors[key]}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:bg-${key}`, `background-color: ${colors[key]}`, result, filters)
      _renderClass(`${state.type}:text-${key}`, `color: ${colors[key]}`, result, filters)
    })
  })
  return result
}

registerClassRenderer(renderClass)
