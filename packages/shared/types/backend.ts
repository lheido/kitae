export type BackendSettings =
  | { name: 'local'; path: string }
  | { name: 'ssh'; user: string; destination: string }

// export interface BackendSettings {
//   name: string
// }

// export interface LocalBackendSettings extends BackendSettings {
//   /**
//    * Path to the project
//    */
//   path: string
// }
