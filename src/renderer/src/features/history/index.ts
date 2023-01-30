import { createStore, produce } from 'solid-js/store'
import { registerGlobalShortcut, Shortcut } from '../keyboard'

export interface HistoryChange {
  execute: () => void
  undo: () => void
}

export interface HistoryChangesState {
  history: HistoryChange[]
  position: number
}

export interface HistoryChangesActions {
  /**
   * Push a change to the history
   */
  makeChange: (change: HistoryChange) => void
  undo: Shortcut
  redo: Shortcut
  isUndoable: () => boolean
  isRedoable: () => boolean
  /**
   * Reset the history state
   */
  reset: () => void
}

const initialState: HistoryChangesState = { history: [], position: -1 }
const [state, setState] = createStore<HistoryChangesState>(initialState)

const makeChange = (change: HistoryChange): void => {
  setState(
    produce((s) => {
      s.position += 1
      s.history.splice(s.position, s.position + 1)
      s.history.push(change)
      change.execute()
    })
  )
}

const undo = new Shortcut(
  ['Control', 'z'],
  (): void => {
    if (isUndoable()) {
      setState(
        produce((u) => {
          u.history[u.position].undo()
          u.position -= 1
        })
      )
    }
  },
  { preventDefault: true }
)
const redo = new Shortcut(
  ['Control', 'y'],
  (): void => {
    if (isRedoable()) {
      setState(
        produce((u) => {
          if (u.position < u.history.length - 1) {
            u.position += 1
            u.history[u.position].execute()
          }
        })
      )
    }
  },
  { preventDefault: true }
)

const isUndoable = (): boolean => state.position >= 0

const isRedoable = (): boolean => state.position < state.history.length - 1

const actions: HistoryChangesActions = {
  makeChange,
  undo,
  redo,
  isUndoable,
  isRedoable,
  reset: (): void => {
    setState(initialState)
  }
}

export const useHistory = (): [HistoryChangesState, HistoryChangesActions] => {
  registerGlobalShortcut(undo)
  registerGlobalShortcut(redo)
  return [state, actions]
}
