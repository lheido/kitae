export type WindowArgumentsKeys = 'title-bar-overlay-height'

export type WindowArgs = Record<WindowArgumentsKeys, string>

export interface KitaeWindowAPI {
  windowArgs: WindowArgs
}

export interface WindowSettings {
  maximized: boolean
  height: number
  width: number
}

export interface KitaeSettings {
  window: WindowSettings
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray | undefined

export interface JSONObject {
  [k: string]: JSONValue
}

export type JSONArray = Array<JSONValue>
