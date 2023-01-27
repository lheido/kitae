import { Workspace, WorkspaceData } from '@kitae/shared/types'
import { api } from '@renderer/features/api'
import { workspacesState } from '@renderer/features/workspaces'
import { createShortcut } from '@solid-primitives/keyboard'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createContext, createEffect } from 'solid-js'
import { createStore, produce, SetStoreFunction } from 'solid-js/store'
import {
  Path,
  WorkspaceDataProviderProps,
  WorkspaceDataState,
  WorkspaceDataUpdates,
  WorkspaceUpdate
} from '../types'
import { walker } from '../utils'

export type ResultWorkspaceDataContext = [
  WorkspaceDataState,
  WorkspaceDataUpdates,
  {
    setState: SetStoreFunction<WorkspaceDataState>
    createUpdate: (update: WorkspaceUpdate) => void
    undo: { (): void; shortcut: string[] }
    redo: { (): void; shortcut: string[] }
    isUndoable: () => boolean
    isRedoable: () => boolean
    select: (path: Path) => void
    get: (path: Path) => unknown
    samePath: (path1: Path, path2: Path) => boolean
  }
]

const initialValue: WorkspaceDataState = { selectedPath: [], data: undefined, state: 'loading' }
const initialUpdates: WorkspaceDataUpdates = { history: [], position: -1, waitForSave: false }
const fallbackUndo = (): void => {}
fallbackUndo.shortcut = []
const fallbackRedo = (): void => {}
fallbackRedo.shortcut = []

export const WorkspaceDataContext = createContext<ResultWorkspaceDataContext>([
  initialValue,
  initialUpdates,
  {
    setState: (): void => {},
    createUpdate: (): void => {},
    select: (): void => {},
    get: (): unknown => undefined,
    undo: fallbackUndo,
    redo: fallbackRedo,
    isUndoable: (): boolean => false,
    isRedoable: (): boolean => false,
    samePath: (): boolean => false
  }
])

export const WorkspaceDataProvider: Component<WorkspaceDataProviderProps> = (
  props: WorkspaceDataProviderProps
) => {
  const [state, setState] = createStore<WorkspaceDataState>(initialValue)
  const [updates, setUpdates] = createStore<WorkspaceDataUpdates>(initialUpdates)
  const saveWorkspaceData = debounce(
    async (workspace: Workspace, data: WorkspaceData): Promise<void> => {
      await api.setWorkspaceData(
        JSON.parse(JSON.stringify(workspace)),
        JSON.parse(JSON.stringify(data))
      )
      setUpdates('waitForSave', false)
    },
    2000
  )
  const saveWorkspaceDataHandler = (workspace: Workspace, data: WorkspaceData): void => {
    saveWorkspaceData.clear()
    setUpdates('waitForSave', true)
    saveWorkspaceData(workspace, data)
  }
  const undo = (): void => {
    setUpdates(
      produce((u) => {
        u.history[u.position].undo()
        u.position -= 1
        saveWorkspaceDataHandler(
          workspacesState.currentWorkspace as Workspace,
          state.data as WorkspaceData
        )
      })
    )
  }
  const redo = (): void => {
    setUpdates(
      produce((u) => {
        if (u.position < u.history.length - 1) {
          u.position += 1
          u.history[u.position].execute()
          saveWorkspaceDataHandler(
            workspacesState.currentWorkspace as Workspace,
            state.data as WorkspaceData
          )
        }
      })
    )
  }
  undo.shortcut = ['Control', 'z']
  redo.shortcut = ['Control', 'y']
  const isUndoable = (): boolean => updates.position >= 0
  const isRedoable = (): boolean => updates.position < updates.history.length - 1
  const store: ResultWorkspaceDataContext = [
    state,
    updates,
    {
      setState,
      createUpdate: (update): void => {
        setUpdates(
          produce((u) => {
            u.position += 1
            u.history.splice(u.position, u.position + 1)
            u.history.push(update)
            update.execute()
            saveWorkspaceDataHandler(
              workspacesState.currentWorkspace as Workspace,
              state.data as WorkspaceData
            )
          })
        )
      },
      undo,
      redo,
      isUndoable,
      isRedoable,
      select: (path): void => {
        setState('selectedPath', path)
      },
      get: (path): unknown => {
        return walker(state.data as WorkspaceData, path)
      },
      samePath: (path1, path2): boolean => {
        if (path1.length !== path2.length) {
          return false
        }
        return path1.every((value, index) => value === path2[index])
      }
    }
  ]
  createEffect(() => {
    if (workspacesState.current !== undefined) {
      api
        .getWorkspaceData(JSON.parse(JSON.stringify(workspacesState.currentWorkspace)))
        .then((result) => {
          if ('themes' in result) {
            setState('data', result as WorkspaceData)
            setState('state', 'ready')
          } else {
            setState('state', 'error')
            setState('error', result as Error)
          }
        })
    }
  })
  createShortcut(
    undo.shortcut,
    () => {
      if (isUndoable()) {
        undo()
      }
    },
    { preventDefault: true }
  )
  createShortcut(
    redo.shortcut,
    () => {
      if (isRedoable()) {
        redo()
      }
    },
    { preventDefault: true }
  )
  return (
    <WorkspaceDataContext.Provider value={store}>{props.children}</WorkspaceDataContext.Provider>
  )
}
