import { Path, WorkspaceData } from '@kitae/shared/types'
import { createStore, produce } from 'solid-js/store'
import { walker } from './utils'

export interface DesignerState {
  /**
   * The current displayed page in the preview panel.
   */
  page?: string
  /**
   * The current edited path in the workspace data tree.
   */
  current: Path
  /**
   * The complete workspace data tree.
   */
  data?: WorkspaceData
  waitForSave: boolean
  error?: unknown
}

export interface DesignerStateActions {
  navigate: (path: Path) => void
  updatePath: (path: Path, updateFn: (data: never, parent: never, state: never) => void) => void
  waitForSave: (value: boolean) => void
  setData: (data?: WorkspaceData) => void
  setError: (error?: unknown) => void
  setPage: (page?: string) => void
  getCurrentData: () => unknown
}

export const initialState: DesignerState = {
  page: undefined,
  current: ['pages'],
  waitForSave: false,
  data: undefined,
  error: undefined
}

const [state, setState] = createStore<DesignerState>(initialState)

export const useDesignerState = (): [DesignerState, DesignerStateActions] => {
  return [
    state,
    {
      navigate: (path): void => {
        setState('current', path)
      },
      updatePath: (path, updateFn): void => {
        setState(
          produce((s) => {
            const currentData = walker(s.data, path) as never
            const parent = walker(s.data, path.slice(0, -1)) as never
            updateFn(currentData, parent, s as never)
          })
        )
      },
      waitForSave: (value: boolean): void => {
        setState('waitForSave', value)
      },
      setData: (data?: WorkspaceData): void => {
        setState('data', data)
      },
      setError: (error?: unknown): void => {
        setState('error', error)
      },
      setPage: (page?: string): void => {
        setState('page', page)
      },
      getCurrentData: (): unknown => {
        return walker(state.data, state.current)
      }
    }
  ]
}
