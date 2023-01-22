import { Workspace } from './workspace'

export type WindowArgumentsKeys = 'title-bar-overlay-height'

export type WindowArgs = Record<WindowArgumentsKeys, string>

export interface UiApi {
  windowArgs?: WindowArgs

  getWorkspaces(): Promise<Workspace[]>
  updateWorkspaces(workspaces: Workspace[]): Promise<boolean | Error>
  openLocalWorkspace(): Promise<[string] | boolean | Error>
}
