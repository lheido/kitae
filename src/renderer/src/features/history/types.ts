import { Path } from '@kitae/shared/types'
import { Shortcut } from '../keyboard'

export interface HistoryEventChangeAdditionalHandler<
  C,
  H extends HistoryEventChange<C> = HistoryEventChange<C>
> {
  afterExecute?: (change: H) => void
  afterUndo?: (change: H) => void
}

export interface HistoryEventChange<C> {
  path: Path
  changes: C
  handler: string
}

export type HistoryEventChangeWithAdditionalHandler<
  C,
  H extends HistoryEventChange<C> = HistoryEventChange<C>
> = HistoryEventChange<C> & HistoryEventChangeAdditionalHandler<C, H>

export interface HistoryEvent<C, H extends HistoryEventChange<C> = HistoryEventChange<C>> {
  execute: (change: H) => void
  undo: (change: H) => void
}

export interface HistoryChangesState {
  history: HistoryEventChangeWithAdditionalHandler<unknown>[]
  position: number
}

export interface HistoryActions {
  /**
   * Push a change to the history
   */
  makeChange: <C>(change: HistoryEventChangeWithAdditionalHandler<C>) => void
  undo: Shortcut
  redo: Shortcut
  isUndoable: () => boolean
  isRedoable: () => boolean
  /**
   * Reset the history state
   */
  reset: () => void
}
