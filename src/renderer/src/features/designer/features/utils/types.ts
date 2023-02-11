import { ComponentData, Path, WorkspaceData } from '@kitae/shared/types'

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

// export type ThemeFormData = Pick<ThemeData, 'name'>

export enum DesignerHistoryHandlers {
  ADD_THEME_ENTRY = 'themes:addThemeEntry',
  UPDATE_THEME_ENTRY = 'themes:updateThemeEntry',
  DELETE_THEME_ENTRY = 'themes:deleteThemeEntry',
  ADD_PAGE_DATA = 'pages:addComponentData',
  UPDATE_PAGE_DATA = 'pages:updateComponentData',
  DELETE_PAGE_DATA = 'pages:deleteComponentData',
  ADD_COMPONENT_DATA = 'components:addComponentData',
  DELETE_COMPONENT_DATA = 'components:deleteComponentData',
  UPDATE_TEXT_COMPONENT_DATA = 'components:updateTextComponentData',
  MOVE_COMPONENT_DATA = 'components:moveComponentData',
  UPDATE_NAME_PROPERTY = 'components:updateNameProperty',
  UPDATE_VALUE_PROPERTY = 'components:updateValueProperty',
  UPDATE_CONFIG_PROPERTY = 'components:updateConfigsProperty',
  ADD_THEME = 'themes:addTheme',
  DELETE_THEME = 'themes:deleteTheme',
  //OLD
  UPDATE_THEME_DATA = 'themes:updateThemeData',
  DELETE_THEME_DATA = 'themes:deleteThemeData',
  ADD_THEME_DATA = 'themes:addThemeData',
  UPDATE_CONTAINER_COMPONENT_DATA = 'components:updateContainerComponentData'
}

export interface FlatComponentData extends ComponentData {
  path: Path
  depth: number
}
