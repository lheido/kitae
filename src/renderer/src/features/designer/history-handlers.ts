/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentData, Path } from '@kitae/shared/types'
import { HistoryChangeHandler } from '../history'
import { useDesignerState } from './features/state/designer.state'
import { samePath } from './features/utils/same-path.util'
import { DesignerHistoryHandlers, WorkspaceDataState } from './features/utils/types'
import { walker } from './features/utils/walker.util'

const [, { updatePath }] = useDesignerState()

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
  [DesignerHistoryHandlers.UPDATE_TEXT_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        const newData = (changes as [ComponentData, ComponentData])[1]
        current.name = newData.config.text
        current.config.text = newData.config.text
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        const oldData = (changes as [ComponentData, ComponentData])[0]
        current.name = oldData.config.text
        current.config.text = oldData.config.text
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
  },
  [DesignerHistoryHandlers.MOVE_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(
        path,
        (current: ComponentData, parent: ComponentData[], state: WorkspaceDataState): void => {
          const target = [...(changes as Path[])[1]]
          const index = target.pop() as number
          const container = walker<ComponentData>(state.data, target.slice(0, -1))
          const isSameParent = samePath(target, path.slice(0, -1))
          if (isSameParent) {
            const currentIndex = path[path.length - 1] as number
            if (currentIndex < index) {
              container?.children?.splice(index + 1, 0, current)
              container?.children?.splice(currentIndex, 1)
            } else {
              container?.children?.splice(currentIndex, 1)
              container?.children?.splice(index, 0, current)
            }
          } else {
            container?.children?.splice(index, 0, current)
            parent.splice(path[path.length - 1] as number, 1)
          }
        }
      )
    },
    undo: ({ path, changes }): void => {
      const currentTargetPath = [...(changes as Path[])[1]]
      const currentContainerPath = currentTargetPath.slice(0, -2)
      updatePath(
        currentContainerPath,
        (container: ComponentData, parent: ComponentData[], state: WorkspaceDataState) => {
          const index = currentTargetPath[currentTargetPath.length - 1] as number
          const components = container
            ? container.children?.splice(index, 1)
            : parent[parent.length - 1].children?.splice(index, 1)
          if (components && components.length > 0) {
            const component = components[0]
            const oldIndex = path[path.length - 1] as number
            const oldContainer = walker<ComponentData>(state.data, path.slice(0, -2))
            if (oldIndex === oldContainer?.children?.length) {
              oldContainer?.children?.push(component)
            } else {
              oldContainer?.children?.splice(oldIndex, 0, component)
            }
          }
        }
      )
    }
  },
  [DesignerHistoryHandlers.ADD_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      const target = [...path]
      const index = target.pop() as number
      updatePath(target, (list: ComponentData[], parent: ComponentData) => {
        if (list) {
          list.splice(index, 0, changes as ComponentData)
        } else {
          parent.children = [changes as ComponentData]
        }
      })
    },
    undo: ({ path }): void => {
      const target = [...path]
      const index = target.pop() as number
      updatePath(target, (list: ComponentData[]) => {
        list.splice(index, 1)
      })
    }
  }
}
