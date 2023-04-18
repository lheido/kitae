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

const defaultValue = 'none'

const _addClass = (
  modifier: string,
  key: string,
  value: string,
  classes: Record<string, boolean>
): void => {
  const v = value.split('-')[1]
  if (v === defaultValue && modifier === '') return
  classes[`${modifier}rounded${key}${v ? `-${v}` : ''}`] = true
}

const dataToClass = (
  config: RoundedConfig,
  classes: Record<string, boolean>,
  modifier = ''
): void => {
  const { data } = config
  const { tl, tr, bl, br } = data
  const x = tl === tr ? tl : undefined
  const y = bl === br ? bl : undefined
  if (x !== undefined && x === y) {
    _addClass(modifier, '', x, classes)
    return
  }
  _addClass(modifier, '-tl', tl, classes)
  _addClass(modifier, '-tr', tr, classes)
  _addClass(modifier, '-bl', bl, classes)
  _addClass(modifier, '-br', br, classes)
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
  Object.keys(rounded).forEach((k) => {
    let key = k.split('-')[1]
    key = key ? `-${key}` : ''
    _renderClass(`rounded${key}`, `border-radius: ${rounded[k]}`, result, filters)
    _renderClass(`rounded-tl${key}`, `border-top-left-radius: ${rounded[k]}`, result, filters)
    _renderClass(`rounded-tr${key}`, `border-top-right-radius: ${rounded[k]}`, result, filters)
    _renderClass(`rounded-bl${key}`, `border-bottom-left-radius: ${rounded[k]}`, result, filters)
    _renderClass(`rounded-br${key}`, `border-bottom-right-radius: ${rounded[k]}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:rounded${key}`, `border-radius: ${rounded[k]}`, result, filters)
      _renderClass(
        `${state.type}:rounded-tl${key}`,
        `border-top-left-radius: ${rounded[k]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-tr${key}`,
        `border-top-right-radius: ${rounded[k]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-bl${key}`,
        `border-bottom-left-radius: ${rounded[k]}`,
        result,
        filters
      )
      _renderClass(
        `${state.type}:rounded-br${key}`,
        `border-bottom-right-radius: ${rounded[k]}`,
        result,
        filters
      )
    })
  })
  console.log(result)
  return result
}

registerClassRenderer(renderClass)
