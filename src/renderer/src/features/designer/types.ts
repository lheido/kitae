import { WorkspaceData } from '@kitae/shared/types'
import { JSX } from 'solid-js'

export type Path = (string | number)[]

export interface WorkspaceDataProviderProps {
  children: JSX.Element
}

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
}
