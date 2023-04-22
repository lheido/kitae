import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

type SizingKeys = 'quick' | 'size'
type SizingType = 'height' | 'width'
interface SizingConfig extends ComponentConfig {
  type: SizingType
  data: Record<SizingKeys, string>
}

const defaultValue = ''

const _addClass = (
  modifier: string,
  type: SizingType,
  value: string,
  classes: Record<string, boolean>
): void => {
  if (value === defaultValue && modifier === '') return
  classes[`${modifier}${type[0]}-${value}`] = true
}

const dataToClass = (
  config: SizingConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { type, data } = config
  const { quick, size } = data
  if (quick !== defaultValue) {
    _addClass(modifier, type, quick, classes)
  } else {
    _addClass(modifier, type, size, classes)
  }
}

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['height', 'width'].includes(config.type))
    .forEach((config) => dataToClass(config as SizingConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps((config.data as { config: SizingConfig[] })?.config, result, `${config.type}:`)
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (theme: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const { sizing } = theme
  const result: Record<string, string> = {}
  _renderClass('h-full', 'height: 100%', result, filters)
  _renderClass('w-full', 'width: 100%', result, filters)
  _renderClass('h-screen', 'height: 100vh', result, filters)
  _renderClass('w-screen', 'width: 100vw', result, filters)

  Object.keys(sizing).forEach((key) => {
    _renderClass(`h-${key}`, `height: ${sizing[key]}`, result, filters)
    _renderClass(`w-${key}`, `width: ${sizing[key]}`, result, filters)

    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:h-${key}`, `height: ${sizing[key]}`, result, filters)
      _renderClass(`${state.type}:w-${key}`, `width: ${sizing[key]}`, result, filters)
    })
  })
  return result
}

registerClassRenderer(renderClass)
