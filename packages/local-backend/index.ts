import { Backend } from '@kitae/shared/backend'
import { defaultWorkspaceData } from '@kitae/shared/default/workspace'
import { LocalBackendSettings, WorkspaceData } from '@kitae/shared/types'
import { constants, promises as fs } from 'fs'
import { join } from 'path'

export class LocalBackend extends Backend {
  declare settings: LocalBackendSettings

  async getWorkspaceData(): Promise<WorkspaceData | undefined> {
    const dataPath = join(this.settings.path, this.settings.dataPath)
    try {
      await fs.access(dataPath, constants.R_OK | constants.W_OK)
      return JSON.parse(await fs.readFile(dataPath, 'utf-8'))
    } catch (error) {
      const workspaceData = defaultWorkspaceData
      await fs.writeFile(dataPath, JSON.stringify(workspaceData, null, 2))
      return workspaceData
    }
  }

  async setWorkspaceData(data: WorkspaceData): Promise<boolean | Error> {
    const dataPath = join(this.settings.path, this.settings.dataPath)
    try {
      // TODO: remove stringify indentation on production build ?
      await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      return error as Error
    }
  }
}
