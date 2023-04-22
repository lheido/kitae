import { ComponentData, WorkspaceTheme } from '@kitae/shared/types'
import { reverseWalkComponentData } from '@kitae/shared/utils'
import { Accessor, createMemo } from 'solid-js'
import { useDesignerState } from '../../../state/designer.state'
import { PropertyProps } from '../types'
import { useConfigPath } from './config.util'

export const getSpecificTheme = (props: PropertyProps): string | undefined => {
  const [state] = useDesignerState()
  // Find the nearest theme config object or fallback to the default theme
  const configPath = useConfigPath(props)
  const componentPath = configPath().slice(0, -2)
  let specificTheme: string | undefined
  reverseWalkComponentData(
    componentPath,
    state.data!,
    (component?: ComponentData): boolean | void => {
      const themeConfig = component?.config?.find((c) => c.type === 'theme') as { data: string }
      specificTheme = themeConfig?.data !== '' ? themeConfig?.data : undefined
      return specificTheme !== undefined
    }
  )
  return specificTheme
}

export const getThemePropertyOptions = (
  property: keyof WorkspaceTheme,
  sort = (a: string, b: string): number => Number(a) - Number(b)
): Accessor<string[]> => {
  const [state] = useDesignerState()
  const memo = createMemo(() => {
    const range = Object.keys(state.data?.theme?.[property] ?? {})
    range.sort(sort)
    return range
  })
  return memo
}
