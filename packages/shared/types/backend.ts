export interface ThemeEntry {
  name: string
  value: string
}

export interface ThemeFontData {
  family: ThemeEntry[]
}

export interface ThemeData {
  name: string
  colors: ThemeEntry[]
  fonts: ThemeFontData
}

export interface WorkspaceData {
  themes: ThemeData[]
}

export type BackendSettings = { data: WorkspaceData } & (
  | { name: 'local'; path: string }
  | { name: 'ssh'; user: string; destination: string }
)
