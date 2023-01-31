import { Component } from 'solid-js'
import PreviewWorkspaceDataProvider from './features/designer/contexts/PreviewWorkspaceDataProvider'
import { WorkspaceDataHsitoryHandlers } from './features/designer/history-handlers'
import { registerHistoryChangeHandler } from './features/history'
import Renderer from './features/renderer/Renderer'

registerHistoryChangeHandler(WorkspaceDataHsitoryHandlers)

const IframePreview: Component = () => {
  return (
    <PreviewWorkspaceDataProvider>
      <Renderer />
    </PreviewWorkspaceDataProvider>
  )
}

export default IframePreview
