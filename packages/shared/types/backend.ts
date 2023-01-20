export interface BackendSettings {
  name: string
}

export interface LocalBackendSettings extends BackendSettings {
  /**
   * Path to the project
   */
  path: string
}
