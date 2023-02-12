import { ComponentData } from '@kitae/shared/types'
import { useDesignerState } from '../../state/designer.state'
import { registerPropertyRenderer } from '../properties-renderer'

const [state] = useDesignerState()
const getValue = (theme: string, name: string): string => {
  return (
    state.data?.theme?.extends?.[theme]?.colors?.[name] ?? state.data?.theme?.colors?.[name] ?? '0'
  )
}

const renderProperties = (component: ComponentData, theme: string): Record<string, string> => {
  const props = {}
  if (component?.config?.backgroundColor) {
    props['background-color'] = getValue(theme, component.config.backgroundColor)
  }
  if (component?.config?.color) {
    props['color'] = getValue(theme, component.config.color)
  }
  return props
}

registerPropertyRenderer(renderProperties)
