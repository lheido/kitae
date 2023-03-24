import { describe, expect, it, vi } from 'vitest'
import { historyEvents, registerHistoryEvents } from './event'
import { isUndoable, makeChange, redo, setState, state, undo } from './state'
import { HistoryEventChange } from './types'

describe('history/state', () => {
  describe('isUndoable', () => {
    it('returns false when position < 0', () => {
      setState({ history: [], position: -1 })
      expect(isUndoable()).toBe(false)
    })

    it('returns true when position >= 0', () => {
      setState({ history: [], position: 0 })
      expect(isUndoable()).toBe(true)
    })
  })

  describe('isRedoable', () => {
    it('returns false when position >= history.length - 1', () => {
      setState({ history: [], position: 0 })
      expect(isUndoable()).toBe(true)
    })

    it('returns true when position < history.length - 1', () => {
      setState({ history: [], position: -1 })
      expect(isUndoable()).toBe(false)
    })
  })

  describe('undo', () => {
    it('should call the undo function of the handler', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [event], position: 0 })
      undo()
      expect(historyEvents.test.undo).toBeCalled()
    })

    it('should call the undo function of the additionalHandler', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = {
        handler: 'test',
        path: [],
        changes: {},
        additionalHandler: {
          undo: vi.fn()
        }
      }
      setState({ history: [event], position: 0 })
      undo()
      expect(event.additionalHandler?.undo).toBeCalled()
    })

    it('should decrement the position', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [event], position: 0 })
      undo()
      expect(state.position).toBe(-1)
    })
  })

  describe('redo', () => {
    it('should do nothing when position >= history.length - 1', () => {
      setState({ history: [], position: 0 })
      redo()
      expect(state.position).toBe(0)
    })

    it('should call the execute function of the handler', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [event], position: -1 })
      redo()
      expect(historyEvents.test.execute).toBeCalled()
    })

    it('should call the execute function of the additionalHandler', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = {
        handler: 'test',
        path: [],
        changes: {},
        additionalHandler: {
          execute: vi.fn()
        }
      }
      setState({ history: [event], position: -1 })
      redo()
      expect(event.additionalHandler?.execute).toBeCalled()
    })

    it('should increment the position', () => {
      registerHistoryEvents({
        test: {
          undo: vi.fn(),
          execute: vi.fn()
        }
      })
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [event], position: -1 })
      redo()
      expect(state.position).toBe(0)
    })
  })

  describe('reset', () => {
    it('should reset the state', () => {
      setState({ history: [], position: -1 })
      expect(state.position).toBe(-1)
      expect(state.history).toEqual([])
    })
  })

  describe('makeChange', () => {
    it('should add the change to the history', () => {
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [], position: -1 })
      expect(state.history).toEqual([])
      makeChange(event)
      expect(state.history).toEqual([event])
    })

    it('should reset the history after the position', () => {
      // TODO: improve this test
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [event], position: 0 })
      expect(state.history).toEqual([event])
      makeChange(event)
      expect(state.history).toEqual([event, event])
    })

    it('should increment the position', () => {
      const event: HistoryEventChange = { handler: 'test', path: [], changes: {} }
      setState({ history: [], position: -1 })
      expect(state.position).toBe(-1)
      makeChange(event)
      expect(state.position).toBe(0)
    })
  })
})
