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
      await fs.writeFile(dataPath, JSON.stringify(workspaceData))
      return workspaceData
    }
  }
}
