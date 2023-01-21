import type { BackendSettings } from './backend'

export interface Workspace {
  id: string
  name: string
  previewUrl: string
  backends: BackendSettings[]
}
