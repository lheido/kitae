import { ComponentData } from '@kitae/shared/types'
import { useDesignerState } from '../../state/designer.state'
import { registerPropertyRenderer } from '../properties-renderer'

const [state] = useDesignerState()
const getValue = (theme: string, name: string): string => {
  return (
    state.data?.theme?.extends?.[theme]?.spacing?.[name] ??
    state.data?.theme?.spacing?.[name] ??
    '0'
  )
}

const renderProperties = (component: ComponentData, theme: string): Record<string, string> => {
  const props = {}
  if (component?.config?.padding) {
    props['padding-left'] = getValue(theme, component.config.padding.left ?? '0')
    props['padding-top'] = getValue(theme, component.config.padding.top ?? '0')
    props['padding-right'] = getValue(theme, component.config.padding.right ?? '0')
    props['padding-bottom'] = getValue(theme, component.config.padding.bottom ?? '0')
  }
  if (component?.config?.margin) {
    props['margin-left'] = getValue(theme, component.config.margin.left ?? '0')
    props['margin-top'] = getValue(theme, component.config.margin.top ?? '0')
    props['margin-right'] = getValue(theme, component.config.margin.right ?? '0')
    props['margin-bottom'] = getValue(theme, component.config.margin.bottom ?? '0')
  }
  return props
}

registerPropertyRenderer(renderProperties)
