import { ComponentConfig, WorkspaceTheme } from '@kitae/shared/types'
import { defaultStateProperties } from '../default-properties'
import {
  PropertyRendererResult,
  registerClassRenderer,
  registerPropertyRenderer
} from '../properties-renderer'
import { _renderClass } from './render-class.helper'

interface FlexConfig extends ComponentConfig {
  type: 'flexItem'
  data: {
    quick: 'expand' | 'auto' | 'initial'
  }
}

const quickCombinationMap = {
  expand: '1 1 0%',
  auto: '1 1 auto',
  initial: '0 1 auto'
}

const dataToClass = (config: FlexConfig, classes: Record<string, boolean>, modifier = ''): void => {
  const { data } = config
  switch (data.quick) {
    case 'expand':
      classes[`${modifier}flex-1`] = true
      break
    case 'auto':
      classes[`${modifier}flex-auto`] = true
      break
    case 'initial':
      classes[`${modifier}flex-initial`] = true
      break
  }
}

const _renderProps = (
  configs: ComponentConfig[],
  style: PropertyRendererResult,
  modifier = ''
): void => {
  configs
    ?.filter((config) => ['flexItem'].includes(config.type))
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

  _renderClass('flex-1', `flex: ${quickCombinationMap['expand']}`, result, filters)
  _renderClass('flex-auto', `flex: ${quickCombinationMap['auto']}`, result, filters)
  _renderClass('flex-initial', `flex: ${quickCombinationMap['initial']}`, result, filters)
  defaultStateProperties.forEach((state) => {
    _renderClass(`${state.type}:flex-1`, `flex: ${quickCombinationMap['expand']}`, result, filters)
    _renderClass(`${state.type}:flex-auto`, `flex: ${quickCombinationMap['auto']}`, result, filters)
    _renderClass(
      `${state.type}:flex-initial`,
      `flex: ${quickCombinationMap['initial']}`,
      result,
      filters
    )
  })
  return result
}

registerClassRenderer(renderClass)
