import { Workspace } from '@kitae/shared/types'
import { app } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const WORKSPACES_FILE_NAME = 'workspaces.json'
const WORKSPACES_PATH = join(app.getPath('userData'), WORKSPACES_FILE_NAME)

try {
  writeFileSync(WORKSPACES_PATH, JSON.stringify([]), { flag: 'wx' })
} catch (error) {
  /* empty */
}

export const fetchWorkspaces = (): Workspace[] => {
  return JSON.parse(readFileSync(WORKSPACES_PATH, { encoding: 'utf8' }))
}

export const updateWorkspaces = (workspaces: Workspace[]): boolean | Error => {
  try {
    writeFileSync(WORKSPACES_PATH, JSON.stringify(workspaces))
  } catch (error) {
    return error as Error
  }
  return true
}
