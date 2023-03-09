import type { BackendSettings } from './backend'

export interface Workspace {
  id: string
  name: string
  backends: BackendSettings[]
}
