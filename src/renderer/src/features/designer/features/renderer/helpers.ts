import { ComponentData } from '@kitae/shared/types'
import { useDesignerState } from '../state/designer.state'
import { walker } from '../utils/walker.util'

export const useIsSelected = (): ((id: string) => boolean) => {
  const [state] = useDesignerState()
  return (id: string): boolean => walker<ComponentData>(state.data, state.current)?.id === id
}
