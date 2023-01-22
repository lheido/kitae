import { UiApi, Workspace } from '@kitae/shared/types'
import { navigate } from '../router'
import { fetchWorkspaces, openWorkspace, workspacesState } from '../workspaces'

export const api = window['api'] as UiApi

export const openLocalWorkspaceHandler = async (): Promise<void> => {
  const result = await api.openLocalWorkspace()
  if (Array.isArray(result)) {
    await fetchWorkspaces()
    openWorkspace(result[0])
    navigate('designer')
  } else if (typeof result === 'string') {
    // TODO: Display an error toast
    console.error(result)
  }
}

export const moveWorkspaceAtFirst = (id: string): void => {
  const workspaces = JSON.parse(JSON.stringify(workspacesState.workspaces)) as Workspace[]
  const item = workspaces.find((w) => w.id === id)
  if (item && item.id !== workspaces[0].id) {
    const newArr = workspaces.filter((w) => w.id !== id)
    newArr.unshift(item)
    api.updateWorkspaces(newArr)
  }
}
