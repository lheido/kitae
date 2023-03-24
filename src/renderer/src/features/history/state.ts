import { createStore, produce } from 'solid-js/store'
import { historyEvents } from './event'
import { HistoryChangesState, HistoryEventChange } from './types'

export const initialState: HistoryChangesState = { history: [], position: -1 }

export const [state, setState] = createStore<HistoryChangesState>(initialState)

export const makeChange = (change: HistoryEventChange): void => {
  setState(
    produce((s) => {
      s.position += 1
      s.history.splice(s.position, s.position + 1)
      s.history.push(change)
      if (historyEvents[change.handler]) {
        historyEvents[change.handler].execute(change)
      }
      if (change.additionalHandler && change.additionalHandler.execute) {
        change.additionalHandler.execute(change)
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
      if (change.additionalHandler && change.additionalHandler.undo) {
        change.additionalHandler.undo(change)
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
        if (change.additionalHandler && change.additionalHandler.execute) {
          change.additionalHandler.execute(change)
        }
      }
    })
  )
}

export const reset = (): void => {
  setState(initialState)
}
