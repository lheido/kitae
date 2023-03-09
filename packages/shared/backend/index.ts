import { BackendSettings, WorkspaceData } from '../types'

export abstract class Backend {
  constructor(public settings: BackendSettings) {}

  abstract getWorkspaceData(): Promise<WorkspaceData | undefined>
  abstract setWorkspaceData(data: WorkspaceData): Promise<boolean | Error>

  /**** Compile API */

  /**
   * TODO: implement this methods using the @kitae/compiler package in each backend
   * TODO: make it abstract
   */
  compile(): void {
    throw new Error('Method not implemented.')
  }
}
