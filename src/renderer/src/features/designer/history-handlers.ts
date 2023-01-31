import { ThemeData, ThemeEntry } from '@kitae/shared/types'
import { HistoryChangeHandler } from '../history'
import { useDesignerState } from './designer.state'
import { DesignerHistoryHandlers, ThemeFormData } from './types'

const [, { updatePath }] = useDesignerState()

export const WorkspaceDataHsitoryHandlers: Record<string, HistoryChangeHandler> = {
  [DesignerHistoryHandlers.ADD_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (list: ThemeEntry[]) => {
        list.push(changes as ThemeEntry)
      })
    },
    undo: ({ path }): void => {
      updatePath(path, (list: ThemeEntry[]) => {
        list.pop()
      })
    }
  },
  [DesignerHistoryHandlers.UPDATE_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ThemeEntry): void => {
        current.name = (changes as [ThemeEntry, ThemeEntry])[1].name
        current.value = (changes as [ThemeEntry, ThemeEntry])[1].value
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ThemeEntry): void => {
        current.name = (changes as [ThemeEntry, ThemeEntry])[0].name
        current.value = (changes as [ThemeEntry, ThemeEntry])[0].value
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_THEME_ENTRY]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: ThemeEntry[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (_, list: ThemeEntry[]) => {
        list.splice(path[path.length - 1] as number, 0, changes as ThemeEntry)
      })
    }
  },
  [DesignerHistoryHandlers.ADD_THEME_DATA]: {
    execute: ({ changes }): void => {
      updatePath(['themes'], (list: ThemeData[]) => {
        list.push(changes as ThemeData)
      })
    },
    undo: (): void => {
      updatePath(['themes'], (list: ThemeData[]) => {
        list.pop()
      })
    }
  },
  [DesignerHistoryHandlers.UPDATE_THEME_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ThemeFormData): void => {
        current.name = (changes as [string, string])[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ThemeFormData): void => {
        current.name = (changes as [string, string])[0]
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_THEME_DATA]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: ThemeData[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (_, list: ThemeData[]) => {
        list.splice(path[path.length - 1] as number, 0, changes as ThemeData)
      })
    }
  }
}
