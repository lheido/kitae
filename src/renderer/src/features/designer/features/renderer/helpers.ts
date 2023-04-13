import { ComponentData } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import { useDesignerState } from '../state/designer.state'

export const useIsSelected = (): ((id: string) => boolean) => {
  const [state] = useDesignerState()
  return (id: string): boolean => walker<ComponentData>(state.data, state.current)?.id === id
}
