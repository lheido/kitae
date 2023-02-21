export type ThemeEntries = Record<string, string>

export type ThemeExtends = Record<keyof Omit<WorkspaceTheme, 'extends'>, ThemeEntries>

export interface WorkspaceTheme {
  colors: ThemeEntries
  fontFamilies: ThemeEntries
  spacing: ThemeEntries
  rounded: ThemeEntries
  extends?: Record<string, ThemeExtends>
}

export interface ComponentConfig {
  type: string
  data: unknown
}

export interface ComponentData {
  id: string
  name: string
  type: string // container | button | etc
  children?: ComponentData[]
  driver?: string // react | astro | solid | etc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: ComponentConfig[]
}

export interface WorkspaceData {
  components: ComponentData[]
  pages: ComponentData[]
  theme: WorkspaceTheme
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
