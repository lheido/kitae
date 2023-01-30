import { WorkspaceData } from '@kitae/shared/types'
import { Component } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import ColorForm from './components/theme/ColorForm'
import FontFamilyForm from './components/theme/FontFamilyForm'
import ThemeForm from './components/theme/ThemeForm'
import ThemeLeftPanel from './components/theme/ThemeLeftPanel'
import { Path } from './types'
import { walker } from './utils'

export interface DesignerState {
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
  updatePath: (path: Path, updateFn: (data: never, parent: never) => void) => void
  waitForSave: (value: boolean) => void
  setData: (data?: WorkspaceData) => void
  setError: (error?: unknown) => void
  getLeftPanel: () => Component | undefined
  getRightPanel: () => Component | undefined
  getCurrentData: () => unknown
}

export interface Route {
  path: string
  left?: Component
  right?: Component
}

export type Routes = Route[]

export const routes: Routes = [
  {
    path: 'themes',
    left: ThemeLeftPanel
  },
  {
    path: 'themes/$',
    right: ThemeForm
  },
  {
    path: 'themes/$/colors/$',
    right: ColorForm
  },
  {
    path: 'themes/$/fonts/family/$',
    right: FontFamilyForm
  }
]

export const initialState: DesignerState = {
  current: ['themes'],
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
            updateFn(currentData, parent)
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
      getLeftPanel: (): Component | undefined => {
        const currentPath = state.current.map((e) => (typeof e === 'number' ? '$' : e)).join('/')
        const components = routes
          .filter((r) => currentPath.startsWith(r.path))
          .filter((r) => !!r.left)
          .map((r) => r.left)
        return components[components.length - 1]
      },
      getRightPanel: (): Component | undefined => {
        const currentPath = state.current.map((e) => (typeof e === 'number' ? '$' : e)).join('/')
        const components = routes
          .filter((r) => currentPath.startsWith(r.path))
          .filter((r) => !!r.right)
          .map((r) => r.right)
        return components[components.length - 1]
      },
      getCurrentData: (): unknown => {
        return walker(state.data, state.current)
      }
    }
  ]
}
