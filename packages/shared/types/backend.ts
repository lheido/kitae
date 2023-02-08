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
  spacing: ThemeEntry[]
  rounded: ThemeEntry[]
}

export interface ComponentData {
  id: string
  name: string
  type: string // container | button | etc
  children?: ComponentData[]
  driver?: string // react | astro | solid | etc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
}

export interface WorkspaceData {
  components: ComponentData[]
  pages: ComponentData[]
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
