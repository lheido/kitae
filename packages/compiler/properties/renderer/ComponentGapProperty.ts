import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

type GapKeys = 'x' | 'y'
interface GapConfig extends ComponentConfig {
  type: 'gap'
  data: Record<GapKeys, string>
}

const dataToClass = (config: GapConfig, classes: Record<string, boolean>, modifier = ''): void => {
  const { type, data } = config
  const { x, y } = data
  if (x === y) {
    classes[`${modifier}${type}-${x}`] = true
  } else {
    classes[`${modifier}${type}-x-${x}`] = true
    classes[`${modifier}${type}-y-${y}`] = true
  }
}

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['gap'].includes(config.type))
    .forEach((config) => dataToClass(config as GapConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps((config.data as { config: GapConfig[] })?.config, result, `${config.type}:`)
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const { spacing } = theme
  const result: Record<string, string> = {}
  Object.keys(spacing).forEach((key) => {
    _renderClass(`gap-${key}`, `gap: ${spacing[key]}`, result, filters)
    _renderClass(`gap-x-${key}`, `gap-x: ${spacing[key]}`, result, filters)
    _renderClass(`gap-y-${key}`, `gap-y: ${spacing[key]}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:gap-${key}`, `gap: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:gap-x-${key}`, `gap-x: ${spacing[key]}`, result, filters)
      _renderClass(`${state.type}:gap-y-${key}`, `gap-y: ${spacing[key]}`, result, filters)
    })
  })
  return result
}

registerClassRenderer(renderClass)
