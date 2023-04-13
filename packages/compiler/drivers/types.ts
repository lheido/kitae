import { ComponentData, WorkspaceData } from '@kitae/shared/types'

export type RendererFunc = (
  data: ComponentData,
  workspace: WorkspaceData,
  render: (component: ComponentData, workspace: WorkspaceData) => string,
  style: (workspace: WorkspaceData, useFilters: boolean) => string
) => string
