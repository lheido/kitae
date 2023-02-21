/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig } from '@kitae/shared/types'
import { registerHistoryChangeHandler } from '@renderer/features/history'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'

const [, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig): void => {
        current.data = (changes as [any, any])[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig): void => {
        current.data = (changes as [any, any])[0]
      })
    }
  }
})
