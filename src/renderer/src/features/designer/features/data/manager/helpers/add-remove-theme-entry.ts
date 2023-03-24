import { ThemeEntries } from '@kitae/shared/types'
import { registerHistoryEvents } from '@renderer/features/history'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'

const [, { updatePath }] = useDesignerState()

registerHistoryEvents({
  [DesignerHistoryHandlers.ADD_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      const { name, value } = changes as ThemeEntries
      updatePath(path, (data: ThemeEntries) => {
        data[name] = value
      })
    },
    undo: ({ path, changes }): void => {
      const { name } = changes as ThemeEntries
      updatePath(path, (data: ThemeEntries) => {
        delete data[name]
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      const { name } = changes as ThemeEntries
      updatePath(path, (data: ThemeEntries) => {
        delete data[name]
      })
    },
    undo: ({ path, changes }): void => {
      const { name, value } = changes as ThemeEntries
      updatePath(path, (data: ThemeEntries) => {
        data[name] = value
      })
    }
  }
})
