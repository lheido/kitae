import { ComponentConfig, ComponentData, Path } from '@kitae/shared/types'
import {
  HistoryEventChangeWithAdditionalHandler,
  makeChange,
  registerHistoryEvents
} from '@renderer/features/history'
import { useDesignerState } from '../state/designer.state'
import { samePath } from '../utils/same-path.util'
import { WorkspaceDataState } from '../utils/types'
import { walker } from '../utils/walker.util'

const [, { updatePath }] = useDesignerState()

enum DesignerComponentPropertyAddHistoryEvents {
  ADD_CONFIG_DATA = 'componentProperty:addConfigData'
}

enum DesignerComponentPropertyMoveHistoryEvents {
  MOVE_CONFIG_DATA = 'componentProperty:moveConfigData'
}

enum DesignerComponentPropertyUpdateHistoryEvents {
  UPDATE_CONFIG_PROPERTY = 'componentProperty:updateConfigProperty'
}

enum DesignerComponentPropertyUpdateTextHistoryEvents {
  UPDATE_TEXT_CONFIG_PROPERTY = 'componentProperty:updateTextConfigProperty'
}

enum DesignerComponentPropertyUpdateNameHistoryEvents {
  UPDATE_NAME_PROPERTY = 'componentProperty:updateNameProperty'
}

export const DesignerComponentPropertyHistoryEvents = {
  ...DesignerComponentPropertyAddHistoryEvents,
  ...DesignerComponentPropertyMoveHistoryEvents
}

export type DesignerComponentPropertyHistoryEvents = typeof DesignerComponentPropertyHistoryEvents

registerHistoryEvents<ComponentConfig, DesignerComponentPropertyAddHistoryEvents>({
  [DesignerComponentPropertyHistoryEvents.ADD_CONFIG_DATA]: {
    execute: ({ path, changes }): void => {
      const target = [...path]
      const index = target.pop() as number
      updatePath(target, (list: ComponentConfig[], parent: ComponentData) => {
        if (list) {
          list.splice(index, 0, changes)
        } else {
          parent.config = [changes]
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
})

registerHistoryEvents<Path[], DesignerComponentPropertyMoveHistoryEvents>({
  [DesignerComponentPropertyHistoryEvents.MOVE_CONFIG_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(
        path,
        (current: ComponentConfig, parent: ComponentConfig[], state: WorkspaceDataState): void => {
          const target = [...changes[1]]
          const index = target.pop() as number
          const container = walker<ComponentData>(state.data, target.slice(0, -1))
          const isSameParent = samePath(target, path.slice(0, -1))
          if (isSameParent) {
            const currentIndex = path[path.length - 1] as number
            if (currentIndex < index) {
              container?.config?.splice(index + 1, 0, current)
              container?.config?.splice(currentIndex, 1)
            } else {
              container?.config?.splice(currentIndex, 1)
              container?.config?.splice(index, 0, current)
            }
          } else {
            container?.config?.splice(index, 0, current)
            parent.splice(path[path.length - 1] as number, 1)
          }
        }
      )
    },
    undo: ({ path, changes }): void => {
      const currentTargetPath = [...changes[1]]
      const currentContainerPath = currentTargetPath.slice(0, -2)
      updatePath(
        currentContainerPath,
        (container: ComponentData, parent: ComponentData[], state: WorkspaceDataState) => {
          const index = currentTargetPath[currentTargetPath.length - 1] as number
          const configs = container
            ? container.config?.splice(index, 1)
            : parent[parent.length - 1].config?.splice(index, 1)
          if (configs && configs.length > 0) {
            const config = configs[0]
            const oldIndex = path[path.length - 1] as number
            const oldContainer = walker<ComponentData>(state.data, path.slice(0, -2))
            if (oldIndex === oldContainer?.config?.length) {
              oldContainer?.config?.push(config)
            } else {
              oldContainer?.config?.splice(oldIndex, 0, config)
            }
          }
        }
      )
    }
  }
})

registerHistoryEvents<unknown[], DesignerComponentPropertyUpdateHistoryEvents>({
  [DesignerComponentPropertyUpdateHistoryEvents.UPDATE_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig): void => {
        current.data = changes[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig): void => {
        current.data = changes[0]
      })
    }
  }
})

registerHistoryEvents<{ text: string }[], DesignerComponentPropertyUpdateTextHistoryEvents>({
  [DesignerComponentPropertyUpdateTextHistoryEvents.UPDATE_TEXT_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig, _, s: WorkspaceDataState): void => {
        current.data = changes[1].text
        const parent = walker(s.data, path.slice(0, -2)) as ComponentData
        parent.name = current.data as string
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig, _, s: WorkspaceDataState): void => {
        current.data = changes[0].text
        const parent = walker(s.data, path.slice(0, -2)) as ComponentData
        parent.name = current.data as string
      })
    }
  }
})

registerHistoryEvents<string[], DesignerComponentPropertyUpdateNameHistoryEvents>({
  [DesignerComponentPropertyUpdateNameHistoryEvents.UPDATE_NAME_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = changes[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = changes[0]
      })
    }
  }
})

export const makeAddConfigChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentConfig>, 'handler'>
): void =>
  makeChange({ ...change, handler: DesignerComponentPropertyAddHistoryEvents.ADD_CONFIG_DATA })

export const makeMoveConfigChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<Path[]>, 'handler'>
): void =>
  makeChange({ ...change, handler: DesignerComponentPropertyMoveHistoryEvents.MOVE_CONFIG_DATA })

export const makeUpdateConfigPropertyChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<unknown[]>, 'handler'>
): void =>
  makeChange({
    ...change,
    handler: DesignerComponentPropertyUpdateHistoryEvents.UPDATE_CONFIG_PROPERTY
  })

export const makeUpdateTextConfigPropertyChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<{ text: string }[]>, 'handler'>
): void =>
  makeChange({
    ...change,
    handler: DesignerComponentPropertyUpdateTextHistoryEvents.UPDATE_TEXT_CONFIG_PROPERTY
  })

export const makeUpdateNamePropertyChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<string[]>, 'handler'>
): void =>
  makeChange({
    ...change,
    handler: DesignerComponentPropertyUpdateNameHistoryEvents.UPDATE_NAME_PROPERTY
  })
