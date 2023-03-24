import { ThemeEntries, ThemeExtends } from '@kitae/shared/types'
import {
  HistoryEventChangeWithAdditionalHandler,
  makeChange,
  registerHistoryEvents
} from '@renderer/features/history'
import { useDesignerState } from '../state/designer.state'

const [, { updatePath }] = useDesignerState()

export enum DesignerThemePageHistoryEvents {
  ADD_THEME = 'themes:addTheme',
  DELETE_THEME = 'themes:deleteTheme'
}

export enum DesignerThemeEntryBaseHistoryEvent {
  ADD_THEME_ENTRY = 'themes:addThemeEntry',
  DELETE_THEME_ENTRY = 'themes:deleteThemeEntry'
}

export enum DesignerThemeEntryUpdateHistoryEvent {
  UPDATE_THEME_ENTRY = 'themes:updateThemeEntry'
}

enum DesignerComponentPropertyUpdateValueHistoryEvents {
  UPDATE_VALUE_PROPERTY = 'componentProperty:updateValueProperty'
}

export interface NewThemeChanges {
  name: string
  value: ThemeExtends
}

registerHistoryEvents<NewThemeChanges, DesignerThemePageHistoryEvents>({
  [DesignerThemePageHistoryEvents.ADD_THEME]: {
    execute: ({ path, changes }): void => {
      const { name, value } = changes
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        current[name] = value
      })
    },
    undo: ({ path, changes }): void => {
      const { name } = changes
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        delete current[name]
      })
    }
  },
  [DesignerThemePageHistoryEvents.DELETE_THEME]: {
    execute: ({ path, changes }): void => {
      const { name } = changes
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        delete current[name]
      })
    },
    undo: ({ path, changes }): void => {
      const { name, value } = changes
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        current[name] = value
      })
    }
  }
})

registerHistoryEvents<ThemeEntries, DesignerThemeEntryBaseHistoryEvent>({
  [DesignerThemeEntryBaseHistoryEvent.ADD_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      const { name, value } = changes
      updatePath(path, (data: ThemeEntries) => {
        data[name] = value
      })
    },
    undo: ({ path, changes }): void => {
      const { name } = changes
      updatePath(path, (data: ThemeEntries) => {
        delete data[name]
      })
    }
  },
  [DesignerThemeEntryBaseHistoryEvent.DELETE_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      const { name } = changes
      updatePath(path, (data: ThemeEntries) => {
        delete data[name]
      })
    },
    undo: ({ path, changes }): void => {
      const { name, value } = changes
      updatePath(path, (data: ThemeEntries) => {
        data[name] = value
      })
    }
  }
})

registerHistoryEvents<ThemeEntries[], DesignerThemeEntryUpdateHistoryEvent>({
  [DesignerThemeEntryUpdateHistoryEvent.UPDATE_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ThemeEntries): void => {
        current.name = changes[1].name
        current.value = changes[1].value
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ThemeEntries): void => {
        current.name = changes[0].name
        current.value = changes[0].value
      })
    }
  }
})

registerHistoryEvents<unknown[], DesignerComponentPropertyUpdateValueHistoryEvents>({
  [DesignerComponentPropertyUpdateValueHistoryEvents.UPDATE_VALUE_PROPERTY]: {
    execute: ({ path, changes }): void => {
      const property = path[path.length - 1]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatePath(path, (_, parent: any): void => {
        parent[property] = changes[1]
      })
    },
    undo: ({ path, changes }): void => {
      const property = path[path.length - 1]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatePath(path, (_, parent: any): void => {
        parent[property] = changes[0]
      })
    }
  }
})

export const makeAddThemeChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<NewThemeChanges>, 'handler'>
): void => makeChange({ ...change, handler: DesignerThemePageHistoryEvents.ADD_THEME })

export const makeDeleteThemeChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<NewThemeChanges>, 'handler'>
): void => makeChange({ ...change, handler: DesignerThemePageHistoryEvents.DELETE_THEME })

export const makeAddThemeEntryChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ThemeEntries>, 'handler'>
): void => makeChange({ ...change, handler: DesignerThemeEntryBaseHistoryEvent.ADD_THEME_ENTRY })

export const makeDeleteThemeEntryChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ThemeEntries>, 'handler'>
): void => makeChange({ ...change, handler: DesignerThemeEntryBaseHistoryEvent.DELETE_THEME_ENTRY })

export const makeUpdateThemeEntryChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ThemeEntries[]>, 'handler'>
): void =>
  makeChange({ ...change, handler: DesignerThemeEntryUpdateHistoryEvent.UPDATE_THEME_ENTRY })

export const makeUpdateValuePropertyChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<unknown[]>, 'handler'>
): void =>
  makeChange({
    ...change,
    handler: DesignerComponentPropertyUpdateValueHistoryEvents.UPDATE_VALUE_PROPERTY
  })
