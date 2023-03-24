import { HistoryEvent } from './types'

export const historyEvents: Record<string, HistoryEvent> = {}

export const registerHistoryEvents = (events: Record<string, HistoryEvent>): void => {
  Object.assign(historyEvents, events)
}
