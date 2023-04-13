import { BackendSettings, WorkspaceData } from '../types'

export abstract class Backend {
  constructor(public settings: BackendSettings) {}

  abstract getWorkspaceData(): Promise<WorkspaceData | undefined>
  abstract setWorkspaceData(data: WorkspaceData): Promise<boolean | Error>
  abstract compileAndWritesFiles(data: WorkspaceData): Promise<boolean | Error>
}
