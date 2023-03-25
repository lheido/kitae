import { createStore, produce } from 'solid-js/store'
import { historyEvents } from './event'
import {
  HistoryChangesState,
  HistoryEventChange,
  HistoryEventChangeWithAdditionalHandler
} from './types'

export const initialState: HistoryChangesState = { history: [], position: -1 }

export const [state, setState] = createStore<HistoryChangesState>(initialState)

export const makeChange = <C = unknown>(
  change: HistoryEventChangeWithAdditionalHandler<C>
): void => {
  setState(
    produce((s) => {
      s.position += 1
      s.history.splice(s.position, s.position + 1)
      s.history.push(change as HistoryEventChange<unknown>)
      if (historyEvents[change.handler]) {
        historyEvents[change.handler].execute(change)
      }
      if (change.afterExecute) {
        change.afterExecute(change)
      }
    })
  )
}

export const isUndoable = (): boolean => state.position >= 0

export const isRedoable = (): boolean => state.position < state.history.length - 1

export const undo = (): void => {
  setState(
    produce((u) => {
      const change = u.history[u.position]
      if (historyEvents[change.handler]) {
        historyEvents[change.handler].undo(change)
      }
      if (change.afterUndo) {
        change.afterUndo(change)
      }
      u.position -= 1
    })
  )
}

export const redo = (): void => {
  setState(
    produce((u) => {
      if (u.position < u.history.length - 1) {
        u.position += 1
        const change = u.history[u.position]
        if (historyEvents[change.handler]) {
          historyEvents[change.handler].execute(change)
        }
        if (change.afterExecute) {
          change.afterExecute(change)
        }
      }
    })
  )
}

export const reset = (): void => {
  setState(
    produce((s) => {
      s.history = []
      s.position = -1
    })
  )
}
