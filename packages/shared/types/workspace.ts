import type { BackendSettings } from './backend'

export interface Workspace {
  name: string
  previewUrl: string
  backends: BackendSettings[]
}
