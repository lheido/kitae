/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentData } from '@kitae/shared/types'
import { HistoryChangeHandler } from '../history'
import { useDesignerState } from './features/state/designer.state'
import { DesignerHistoryHandlers } from './features/utils/types'

const [, { updatePath, setState }] = useDesignerState()

export const WorkspaceDataHsitoryHandlers: Record<string, HistoryChangeHandler> = {
  [DesignerHistoryHandlers.UPDATE_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [any, any])[1].name
        current.value = (changes as [any, any])[1].value
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [any, any])[0].name
        current.value = (changes as [any, any])[0].value
      })
    }
  },
  [DesignerHistoryHandlers.ADD_THEME_DATA]: {
    execute: ({ changes }): void => {
      updatePath(['themes'], (list: any[]) => {
        list.push(changes as any)
      })
    },
    undo: (): void => {
      updatePath(['themes'], (list: any[]) => {
        list.pop()
      })
    }
  },
  [DesignerHistoryHandlers.UPDATE_THEME_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [string, string])[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [string, string])[0]
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_THEME_DATA]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: any[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (_, list: any[]) => {
        list.splice(path[path.length - 1] as number, 0, changes as any)
      })
    }
  },
  [DesignerHistoryHandlers.ADD_PAGE_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (list: ComponentData[]) => {
        list.push(changes as ComponentData)
      })
    },
    undo: ({ path }): void => {
      updatePath(path, (list: ComponentData[]) => {
        list.pop()
      })
    }
  },
  [DesignerHistoryHandlers.UPDATE_PAGE_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = (changes as [ComponentData, ComponentData])[1].name
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = (changes as [ComponentData, ComponentData])[0].name
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_PAGE_DATA]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: ComponentData[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (_, list: ComponentData[]) => {
        list.splice(path[path.length - 1] as number, 0, changes as ComponentData)
      })
    }
  },
  [DesignerHistoryHandlers.UPDATE_CONTAINER_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        const newData = (changes as [ComponentData, ComponentData])[1]
        current.config = newData.config
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        const oldData = (changes as [ComponentData, ComponentData])[0]
        current.config = oldData.config
      })
    }
  }
}
