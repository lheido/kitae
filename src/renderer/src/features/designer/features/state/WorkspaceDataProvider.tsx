import { Workspace, WorkspaceData } from '@kitae/shared/types'
import { api } from '@renderer/features/api'
import { useHistory } from '@renderer/features/history'
import { workspacesState } from '@renderer/features/workspaces'
import { ProviderProps } from '@renderer/types'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createContext, createEffect } from 'solid-js'
import {
  DesignerState,
  DesignerStateActions,
  initialState,
  useDesignerState
} from './designer.state'

export const WorkspaceDataContext = createContext<[DesignerState, DesignerStateActions]>([
  JSON.parse(JSON.stringify(initialState)),
  {} as DesignerStateActions
])

export const WorkspaceDataProvider: Component<ProviderProps> = (props: ProviderProps) => {
  const [state, actions] = useDesignerState()
  const [historyState] = useHistory()

  const saveWorkspaceData = debounce(
    async (workspace: Workspace, data: WorkspaceData): Promise<void> => {
      await api.setWorkspaceData(
        JSON.parse(JSON.stringify(workspace)),
        JSON.parse(JSON.stringify(data))
      )
      actions.waitForSave(false)
    },
    2000
  )
  const saveWorkspaceDataHandler = (workspace: Workspace, data: WorkspaceData): void => {
    saveWorkspaceData.clear()
    actions.waitForSave(true)
    saveWorkspaceData(workspace, data)
  }
  createEffect(() => {
    if (workspacesState.current !== undefined) {
      api
        .getWorkspaceData(JSON.parse(JSON.stringify(workspacesState.currentWorkspace)))
        .then((result) => {
          if ('theme' in result) {
            actions.setData(result as WorkspaceData)
            actions.setError(undefined)
          } else {
            actions.setData(undefined)
            actions.setError(result)
          }
        })
    }
  })
  createEffect((prev) => {
    if (
      prev !== undefined &&
      historyState.position > -1 &&
      workspacesState.current !== undefined &&
      state.data
    ) {
      saveWorkspaceDataHandler(
        workspacesState.currentWorkspace as Workspace,
        state.data as WorkspaceData
      )
    }
    return historyState.position
  })
  return (
    <WorkspaceDataContext.Provider value={[state, actions]}>
      {props.children}
    </WorkspaceDataContext.Provider>
  )
}
