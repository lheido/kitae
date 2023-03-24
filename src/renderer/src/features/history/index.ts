import { Shortcut } from '../keyboard'
import { isRedoable, isUndoable, makeChange, redo, reset, state, undo } from './state'
import { HistoryActions, HistoryChangesState } from './types'

export * from './event'

export const undoShortcut = new Shortcut(
  ['Control', 'z'],
  (): void => {
    if (isUndoable()) {
      undo()
    }
  },
  { preventDefault: true }
)
export const redoShortcut = new Shortcut(
  ['Control', 'y'],
  (): void => {
    if (isRedoable()) {
      redo()
    }
  },
  { preventDefault: true }
)

export const useHistory = (): [HistoryChangesState, HistoryActions] => {
  return [
    state,
    {
      makeChange,
      undo: undoShortcut,
      redo: redoShortcut,
      isUndoable,
      isRedoable,
      reset
    }
  ]
}
