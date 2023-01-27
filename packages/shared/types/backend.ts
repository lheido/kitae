export interface ThemeEntry {
  name: string
  value: string
}

export interface ThemeFontData {
  family: ThemeEntry[]
}

export interface ThemeData {
  id: string
  name: string
  colors: ThemeEntry[]
  fonts: ThemeFontData
}

export interface WorkspaceData {
  themes: ThemeData[]
}

export interface BaseBackendSettings {
  data: WorkspaceData
}

export interface LocalBackendSettings extends BaseBackendSettings {
  name: 'local'
  workspaceId: string
  dataPath: string
  path: string
}

export interface SshBackendSettings extends BaseBackendSettings {
  name: 'ssh'
  workspaceId: string
  user: string
  destination: string
}

export type BackendSettings = LocalBackendSettings | SshBackendSettings
