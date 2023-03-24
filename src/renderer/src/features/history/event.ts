import { HistoryEvent } from './types'

export const historyEvents: Record<string, HistoryEvent<unknown>> = {}

export const registerHistoryEvents = <
  C,
  K extends string = string,
  E extends HistoryEvent<C> = HistoryEvent<C>
>(
  events: Record<K, E>
): void => {
  Object.assign(historyEvents, events)
}
