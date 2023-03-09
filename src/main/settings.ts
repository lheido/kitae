import { JSONValue, KitaeSettings } from '@kitae/shared/types'
import { app } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const SETTINGS_FILE_NAME = 'settings.json'
const SETTINGS_PATH = join(app.getPath('userData'), SETTINGS_FILE_NAME)

const DEFAULT_SETTINGS = {
  window: {
    height: 670,
    width: 900,
    maximized: false
  }
} as Partial<KitaeSettings>

try {
  writeFileSync(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS), { flag: 'wx' })
} catch (error) {
  /* empty */
}

let settings: KitaeSettings = fetchSettings()

export function fetchSettings(): KitaeSettings {
  const _settings = JSON.parse(readFileSync(SETTINGS_PATH, { encoding: 'utf8' })) as never
  if ('window' in _settings) {
    return _settings
  }
  return DEFAULT_SETTINGS as KitaeSettings
}

export function getSettings(): KitaeSettings {
  return settings
}

export function updateSettings(obj: KitaeSettings): void
export function updateSettings(path: string, value: JSONValue): void
export function updateSettings(pathOrObj: string | KitaeSettings, value?: JSONValue): void {
  if (typeof pathOrObj === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subSettings: any = settings
    pathOrObj.split('.').forEach((key, index, arr) => {
      if (key in subSettings) {
        if (index < arr.length - 1 && typeof subSettings[key] === 'object') {
          subSettings = subSettings[key]
        } else {
          subSettings[key] = value
        }
      }
    })
  } else {
    settings = pathOrObj
  }
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings))
}
