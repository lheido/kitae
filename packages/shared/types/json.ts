export type JSONValue = string | number | boolean | JSONObject | JSONArray | undefined

export interface JSONObject {
  [k: string]: JSONValue
}

export type JSONArray = Array<JSONValue>
