import { WorkspaceData } from '@kitae/shared/types'
import { HistoryChange, useHistory } from '@renderer/features/history'
import { invoke, on } from '@renderer/features/iframe-api/preview'
import { ProviderProps } from '@renderer/types'
import { Component, onMount } from 'solid-js'
import { useDesignerState } from '../designer.state'
import { WorkspaceDataContext } from './WorkspaceDataProvider'

const PreviewWorkspaceDataProvider: Component<ProviderProps> = (props: ProviderProps) => {
  const [state, actions] = useDesignerState()
  const [, { makeChange, undo, redo }] = useHistory()

  onMount(() => {
    invoke<unknown, WorkspaceData | Error>('request-workspace-data').then((result) => {
      if ('themes' in result) {
        actions.setData(result as WorkspaceData)
        actions.setError(undefined)
      } else {
        actions.setData(undefined)
        actions.setError(result)
      }

      invoke('request-current-page').then((page) => {
        actions.setPage(page as string)
      })
    })
    on('workspace-data-changes', (changes?: HistoryChange) => {
      if (!changes) return
      makeChange(changes)
    })
    on('current-page-change', (page?: string) => {
      actions.setPage(page)
    })
    on('undo', () => {
      undo.execute()
    })
    on('redo', () => {
      redo.execute()
    })
  })
  return (
    <WorkspaceDataContext.Provider value={[state, actions]}>
      {props.children}
    </WorkspaceDataContext.Provider>
  )
}

export default PreviewWorkspaceDataProvider
