import { Path, WorkspaceData } from '@kitae/shared/types'
import { createStore, produce, SetStoreFunction } from 'solid-js/store'
import { walker } from '../utils/walker.util'

export interface DesignerState {
  /**
   * The current displayed page in the preview panel.
   */
  page?: string
  /**
   * The current theme.
   */
  theme: string
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
  setState: SetStoreFunction<DesignerState>
  updatePath: (path: Path, updateFn: (data: never, parent: never, state: never) => void) => void
  waitForSave: (value: boolean) => void
  setData: (data?: WorkspaceData) => void
  setError: (error?: unknown) => void
  setPage: (page?: string) => void
  setTheme: (theme: string) => void
  getCurrentData: () => unknown
  reset: () => void
}

export const initialState: DesignerState = {
  page: undefined,
  theme: 'default',
  current: ['pages'],
  waitForSave: false,
  data: undefined,
  error: undefined
}

const [state, setState] = createStore<DesignerState>(JSON.parse(JSON.stringify(initialState)))

export const useDesignerState = (): [DesignerState, DesignerStateActions] => {
  return [
    state,
    {
      navigate: (path): void => {
        setState('current', path)
      },
      setState,
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
      setTheme: (theme: string): void => {
        setState('theme', theme)
      },
      getCurrentData: (): unknown => {
        return walker(state.data, state.current)
      },
      reset: (): void => {
        setState(
          produce((s) => {
            s.page = undefined
            s.theme = 'default'
            s.current = ['pages']
            s.waitForSave = false
            s.data = undefined
            s.error = undefined
          })
        )
      }
    }
  ]
}
