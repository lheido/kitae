import { ComponentData, ThemeEntry } from '@kitae/shared/types'
import { useDesignerState } from '../designer'
import { walker } from '../designer/utils'

export const useIsSelected = (): ((id: string) => boolean) => {
  const [state] = useDesignerState()
  return (id: string): boolean => walker<ComponentData>(state.data, state.current)?.id === id
}

export const getThemeEntryValue = (data: ThemeEntry[], name: string): string | undefined => {
  const entry = data.find((entry) => entry.name === name)
  return entry?.value
}
