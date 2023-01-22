import { Workspace } from '@kitae/shared/types'
import { createStore } from 'solid-js/store'
import { api } from '../api'

export interface WorkspacesState {
  workspaces: Workspace[]
  current?: string
  readonly currentWorkspace: Workspace | undefined
}

export const [workspacesState, setWorkspacesState] = createStore<WorkspacesState>({
  workspaces: [] as Workspace[],
  current: undefined,
  get currentWorkspace(): Workspace | undefined {
    return this.workspaces.find((w) => w.id === this.current)
  }
})

export const fetchWorkspaces = async (): Promise<void> => {
  setWorkspacesState('workspaces', await api.getWorkspaces())
}

export const updateWorkspaces = async (workspaces: Workspace[]): Promise<boolean | Error> => {
  const result = await api.updateWorkspaces(workspaces)
  if (result === true) {
    await fetchWorkspaces()
  }
  return result
}

export const removeWorkspace = async (id: string): Promise<boolean | Error> => {
  const items = workspacesState.workspaces.filter((w) => w.id !== id)
  const result = await api.updateWorkspaces(JSON.parse(JSON.stringify(items)))
  if (result === true) {
    setWorkspacesState('workspaces', items)
  }
  return result
}

export const openWorkspace = (id: string): void => {
  setWorkspacesState('current', id)
}
