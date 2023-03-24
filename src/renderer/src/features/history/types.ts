import { Path } from '@kitae/shared/types'
import { Shortcut } from '../keyboard'

export interface HistoryEventChange<T = unknown> {
  path: Path
  changes: T | T[]
  handler: string
  additionalHandler?: Partial<HistoryEvent>
}

export interface HistoryEvent {
  execute: (change: HistoryEventChange) => void
  undo: (change: HistoryEventChange) => void
}

export interface HistoryChangesState {
  history: HistoryEventChange[]
  position: number
}

export interface HistoryActions {
  /**
   * Push a change to the history
   */
  makeChange: (change: HistoryEventChange) => void
  undo: Shortcut
  redo: Shortcut
  isUndoable: () => boolean
  isRedoable: () => boolean
  /**
   * Reset the history state
   */
  reset: () => void
}
