import { BackendSettings } from '../types'

export abstract class Backend {
  constructor(public settings: BackendSettings) {}

  /**** Compile API */

  /**
   * TODO: implement this methods using the @kitae/compiler package in each backend
   * TODO: make it abstract
   */
  compile(): void {
    throw new Error('Method not implemented.')
  }
}
