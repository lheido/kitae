import { Path } from '@kitae/shared/types'
import { createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { Shortcut } from '../keyboard'

export interface HistoryChange {
  path: Path
  changes: unknown
  handler: string
  additionalHandler?: Partial<HistoryChangeHandler>
}

export interface HistoryChangeHandler {
  execute: (change: HistoryChange) => void
  undo: (change: HistoryChange) => void
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
const historyChangeHandlers: Record<string, HistoryChangeHandler> = {}
const initialState: HistoryChangesState = { history: [], position: -1 }
const [state, setState] = createStore<HistoryChangesState>(initialState)
export const [historyEvent, dispatchEvent] = createSignal<string | undefined>(undefined, {
  equals: () => false
})

const makeChange = (change: HistoryChange): void => {
  setState(
    produce((s) => {
      s.position += 1
      s.history.splice(s.position, s.position + 1)
      s.history.push(change)
      if (historyChangeHandlers[change.handler]) {
        historyChangeHandlers[change.handler].execute(change)
      }
      if (change.additionalHandler && change.additionalHandler.execute) {
        change.additionalHandler.execute(change)
      }
      dispatchEvent('change')
    })
  )
}

export const undo = new Shortcut(
  ['Control', 'z'],
  (): void => {
    if (isUndoable()) {
      setState(
        produce((u) => {
          const change = u.history[u.position]
          if (historyChangeHandlers[change.handler]) {
            historyChangeHandlers[change.handler].undo(change)
          }
          if (change.additionalHandler && change.additionalHandler.undo) {
            change.additionalHandler.undo(change)
          }
          u.position -= 1
          dispatchEvent('undo')
        })
      )
    }
  },
  { preventDefault: true }
)
export const redo = new Shortcut(
  ['Control', 'y'],
  (): void => {
    if (isRedoable()) {
      setState(
        produce((u) => {
          if (u.position < u.history.length - 1) {
            u.position += 1
            const change = u.history[u.position]
            if (historyChangeHandlers[change.handler]) {
              historyChangeHandlers[change.handler].execute(change)
            }
            if (change.additionalHandler && change.additionalHandler.execute) {
              change.additionalHandler.execute(change)
            }
            dispatchEvent('redo')
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
  return [state, actions]
}

export const registerHistoryChangeHandler = (
  handlers: Record<string, HistoryChangeHandler>
): void => {
  Object.assign(historyChangeHandlers, handlers)
}
