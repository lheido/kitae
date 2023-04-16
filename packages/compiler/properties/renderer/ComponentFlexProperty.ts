import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

interface FlexConfig extends ComponentConfig {
  type: 'flex'
  data: {
    justify: 'start' | 'center' | 'end' | 'between' | 'around'
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    wrap: 'nowrap' | 'wrap'
  }
}

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly'
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline'
}

const dataToClass = (config: FlexConfig, classes: Record<string, boolean>, modifier = ''): void => {
  const { data } = config
  classes[`${modifier}flex`] = true
  classes[`${modifier}flex-${data.direction}`] = true
  classes[`${modifier}justify-${data.justify}`] = true
  classes[`${modifier}items-${data.align}`] = true
  classes[`${modifier}flex-${data.wrap}`] = true
}

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['flex'].includes(config.type))
    .forEach((config) => dataToClass(config as FlexConfig, style.class, modifier))
}

const renderProperties = (configs: ComponentConfig[]): PropertyRendererResult => {
  const result: PropertyRendererResult = { class: {} }
  // Take into account the non state properties
  _renderProps(configs, result)
  // Take into account the state properties
  configs
    ?.filter((config) => defaultStateProperties.map((s) => s.type).includes(config.type))
    .forEach((config) => {
      _renderProps((config.data as { config: FlexConfig[] })?.config, result, `${config.type}:`)
    })
  return result
}

registerPropertyRenderer(renderProperties)

const renderClass = (_: WorkspaceTheme, filters: string[] | false): Record<string, string> => {
  const result: Record<string, string> = {}

  _renderClass('flex', 'display: flex', result, filters)
  defaultStateProperties.forEach((state) => {
    _renderClass(`${state.type}:flex`, 'display: flex', result, filters)
  })

  Object.entries(justifyMap).forEach(([key, value]) => {
    _renderClass(`justify-${key}`, `justify-content: ${value}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:justify-${key}`, `justify-content: ${value}`, result, filters)
    })
  })

  Object.entries(alignMap).forEach(([key, value]) => {
    _renderClass(`items-${key}`, `align-items: ${value}`, result, filters)
    defaultStateProperties.forEach((state) => {
      _renderClass(`${state.type}:items-${key}`, `align-items: ${value}`, result, filters)
    })
  })

  _renderClass('flex-row', 'flex-direction: row', result, filters)
  _renderClass('flex-row-reverse', 'flex-direction: row-reverse', result, filters)
  _renderClass('flex-column', 'flex-direction: column', result, filters)
  _renderClass('flex-column-reverse', 'flex-direction: column-reverse', result, filters)
  _renderClass('flex-wrap', 'flex-wrap: wrap', result, filters)
  _renderClass('flex-nowrap', 'flex-wrap: nowrap', result, filters)
  defaultStateProperties.forEach((state) => {
    _renderClass(`${state.type}:flex-row`, 'flex-direction: row', result, filters)
    _renderClass(`${state.type}:flex-row-reverse`, 'flex-direction: row-reverse', result, filters)
    _renderClass(`${state.type}:flex-column`, 'flex-direction: column', result, filters)
    _renderClass(
      `${state.type}:flex-column-reverse`,
      'flex-direction: column-reverse',
      result,
      filters
    )
    _renderClass(`${state.type}:flex-wrap`, 'flex-wrap: wrap', result, filters)
    _renderClass(`${state.type}:flex-nowrap`, 'flex-wrap: nowrap', result, filters)
  })
  return result
}

registerClassRenderer(renderClass)
