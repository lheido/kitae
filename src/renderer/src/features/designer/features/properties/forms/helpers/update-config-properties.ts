/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerHistoryChangeHandler } from '@renderer/features/history'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'

const [, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.config = { ...current.config, ...(changes as [any, any])[1] }
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.config = { ...current.config, ...(changes as [any, any])[0] }
      })
    }
  }
})
