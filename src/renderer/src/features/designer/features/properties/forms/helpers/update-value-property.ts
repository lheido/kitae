/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerHistoryChangeHandler } from '@renderer/features/history'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'

const [, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_VALUE_PROPERTY]: {
    execute: ({ path, changes }): void => {
      const property = path[path.length - 1]
      updatePath(path, (_, parent: any): void => {
        parent[property] = (changes as [any, any])[1]
      })
    },
    undo: ({ path, changes }): void => {
      const property = path[path.length - 1]
      updatePath(path, (_, parent: any): void => {
        parent[property] = (changes as [any, any])[0]
      })
    }
  }
})
