import { Path, ThemeData, WorkspaceData } from '@kitae/shared/types'

export interface WorkspaceDataState {
  selectedPath: Path
  data?: WorkspaceData
  state: 'loading' | 'ready' | 'error'
  error?: Error
}

export interface WorkspaceUpdate {
  execute: () => void
  undo: () => void
}

export interface WorkspaceDataUpdates {
  history: WorkspaceUpdate[]
  position: number
  waitForSave: boolean
}

export type ThemeFormData = Pick<ThemeData, 'name'>

export enum DesignerHistoryHandlers {
  ADD_THEME_ENTRY = 'themes:addThemeEntry',
  UPDATE_THEME_ENTRY = 'themes:updateThemeEntry',
  DELETE_THEME_ENTRY = 'themes:deleteThemeEntry',
  ADD_THEME_DATA = 'themes:addThemeData',
  UPDATE_THEME_DATA = 'themes:updateThemeData',
  DELETE_THEME_DATA = 'themes:deleteThemeData',
  ADD_PAGE_DATA = 'pages:addComponentData',
  UPDATE_PAGE_DATA = 'pages:updateComponentData',
  DELETE_PAGE_DATA = 'pages:deleteComponentData'
}
