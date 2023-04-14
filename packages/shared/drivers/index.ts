import { WorkspaceData, WorkspaceDriver, WorkspaceDriverResult, WorkspaceDrivers } from '../types'
import astro from './astro'

const drivers: Record<WorkspaceDrivers, WorkspaceDriver> = {
  astro
}

export default {
  /**
   * Compile the workspace data to files.
   * @param path The workspace root path
   * @param workspace The workspace data
   * @returns A boolean indicating if the compilation was successful
   */
  compile: async (workspace: WorkspaceData): Promise<WorkspaceDriverResult> => {
    return drivers[workspace.driver].compile(workspace)
  },

  compileAndWritesFiles: async (
    path: string,
    workspace: WorkspaceData
  ): Promise<boolean | Error> => {
    return drivers[workspace.driver].compileAndWritesFiles(path, workspace)
  },

  initWorkspace: async (path: string, workspace: WorkspaceData): Promise<boolean | Error> => {
    return drivers[workspace.driver].initWorkspace(path, workspace)
  }
} as WorkspaceDriver
