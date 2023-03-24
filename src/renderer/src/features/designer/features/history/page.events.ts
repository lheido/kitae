import { ComponentData } from '@kitae/shared/types'
import {
  HistoryEventChangeWithAdditionalHandler,
  makeChange,
  registerHistoryEvents
} from '@renderer/features/history'
import { useDesignerState } from '../state/designer.state'

const [, { updatePath }] = useDesignerState()

export enum DesignerPageBaseHistoryEvents {
  ADD_PAGE_DATA = 'page:addPageData',
  DELETE_PAGE_DATA = 'page:deletePageData'
}

export enum DesignerPageUpdateHistoryEvents {
  UPDATE_PAGE_DATA = 'page:updatePageData'
}

registerHistoryEvents<ComponentData, DesignerPageBaseHistoryEvents>({
  [DesignerPageBaseHistoryEvents.ADD_PAGE_DATA]: {
    execute: <ComponentData>({ path, changes }): void => {
      updatePath(path, (list: ComponentData[]) => {
        list.push(changes)
      })
    },
    undo: ({ path }): void => {
      updatePath(path, (list: ComponentData[]) => {
        list.pop()
      })
    }
  },
  [DesignerPageBaseHistoryEvents.DELETE_PAGE_DATA]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: ComponentData[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: <ComponentData>({ path, changes }): void => {
      updatePath(path, (_, list: ComponentData[]) => {
        list.splice(path[path.length - 1] as number, 0, changes)
      })
    }
  }
})

registerHistoryEvents<ComponentData[], DesignerPageUpdateHistoryEvents>({
  [DesignerPageUpdateHistoryEvents.UPDATE_PAGE_DATA]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = changes[1].name
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentData): void => {
        current.name = changes[0].name
      })
    }
  }
})

export const makeAddPageChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData>, 'handler'>
): void => makeChange({ ...change, handler: DesignerPageBaseHistoryEvents.ADD_PAGE_DATA })

export const makeDeletePageChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData>, 'handler'>
): void => makeChange({ ...change, handler: DesignerPageBaseHistoryEvents.DELETE_PAGE_DATA })

export const makeUpdatePageChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData[]>, 'handler'>
): void => makeChange({ ...change, handler: DesignerPageUpdateHistoryEvents.UPDATE_PAGE_DATA })
