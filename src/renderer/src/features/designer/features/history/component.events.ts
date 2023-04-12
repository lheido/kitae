import { ComponentData, Path } from '@kitae/shared/types'
import {
  HistoryEventChangeWithAdditionalHandler,
  makeChange,
  registerHistoryEvents
} from '@renderer/features/history'
import {
  getComponentData,
  insertComponentData,
  moveComponentData,
  removeComponentData,
  replaceComponentData
} from '@renderer/features/utils/component-data.util'
import { cleanAndUpdateSlots } from '@renderer/features/utils/slot.util'
import { produce } from 'solid-js/store'
import { useDesignerState } from '../state/designer.state'

export enum DesignerComponentBaseHistoryEvents {
  MOVE_COMPONENT_DATA = 'component:moveComponentData',
  ADD_COMPONENT_DATA = 'component:addComponentData'
}

export enum DesignerComponentDeleteHistoryEvents {
  DELETE_COMPONENT_DATA = 'component:deleteComponentData'
}

export enum DesignerComponentCreateCustomHistoryEvents {
  CREATE_CUSTOM_COMPONENT = 'component:createCustomComponent'
}

const [, { setState }] = useDesignerState()

registerHistoryEvents<Path[], DesignerComponentBaseHistoryEvents>({
  [DesignerComponentBaseHistoryEvents.MOVE_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      setState(
        produce((state): void => {
          const to = path.slice(2)
          const from = changes[1].slice(2)
          const currentPage = state.data?.[path[0]][path[1]] as ComponentData
          moveComponentData(to, from, currentPage)
        })
      )
    },
    undo: ({ path, changes }): void => {
      setState(
        produce((state): void => {
          const to = path.slice(2)
          const from = changes[1].slice(2)
          const currentPage = state.data?.[path[0]][path[1]] as ComponentData
          moveComponentData(from, to, currentPage)
        })
      )
    }
  },
  [DesignerComponentBaseHistoryEvents.ADD_COMPONENT_DATA]: {
    execute: ({ path, changes }): void => {
      setState(
        produce((s): void => {
          const currentPage = s.data?.[path[0]][path[1]] as ComponentData
          insertComponentData(path.slice(2), currentPage, changes)
          if (path.includes('components')) {
            const component = getComponentData<ComponentData>(
              path.slice(2),
              s.data?.components[path[1]]
            )
            if (component?.type === 'slot') {
              cleanAndUpdateSlots(s.data?.components[path[1]], s.data!)
            }
          }
        })
      )
    },
    undo: ({ path }): void => {
      setState(
        produce((s): void => {
          let component: ComponentData | undefined
          if (path.includes('components')) {
            component = getComponentData<ComponentData>(path.slice(2), s.data?.components[path[1]])
          }
          const currentPage = s.data?.[path[0]][path[1]] as ComponentData
          removeComponentData(path.slice(2), currentPage)
          if (component && component.type === 'slot') {
            cleanAndUpdateSlots(s.data?.components[path[1]], s.data!)
          }
        })
      )
    }
  }
})

registerHistoryEvents<ComponentData, DesignerComponentDeleteHistoryEvents>({
  [DesignerComponentDeleteHistoryEvents.DELETE_COMPONENT_DATA]: {
    execute: ({ path }): void => {
      setState(
        produce((s): void => {
          const target = path.slice(2)
          let component: ComponentData | undefined
          if (path.includes('components')) {
            component = getComponentData<ComponentData>(path.slice(2), s.data?.components[path[1]])
          }
          removeComponentData(target, s.data?.[path[0]][path[1]])
          if (component && component.type === 'slot') {
            cleanAndUpdateSlots(s.data?.components[path[1]], s.data!)
          }
        })
      )
    },
    undo: ({ path, changes }): void => {
      setState(
        produce((s): void => {
          const target = path.slice(2)
          insertComponentData(target, s.data?.[path[0]][path[1]], changes)
          if (path.includes('components')) {
            const component = getComponentData<ComponentData>(
              path.slice(2),
              s.data?.components[path[1]]
            )
            if (component?.type === 'slot') {
              cleanAndUpdateSlots(s.data?.components[path[1]], s.data!)
            }
          }
        })
      )
    }
  }
})

registerHistoryEvents<ComponentData, DesignerComponentCreateCustomHistoryEvents>({
  [DesignerComponentCreateCustomHistoryEvents.CREATE_CUSTOM_COMPONENT]: {
    execute: ({ path, changes }): void => {
      const customComponentData: ComponentData = {
        id: crypto.randomUUID(),
        type: 'custom',
        // TODO: Initialize with a more useful name
        name: 'Custom',
        children: [changes as ComponentData],
        config: []
      }
      setState(
        produce((s): void => {
          s.data!.components.push(customComponentData)
          replaceComponentData(path.slice(2), s.data?.[path[0]][path[1]], {
            ...customComponentData,
            children: [],
            slots: {},
            ref: customComponentData.id,
            id: crypto.randomUUID()
          })
        })
      )
    },
    undo: ({ path, changes }): void => {
      setState(
        produce((s): void => {
          s.data!.components.pop()
          replaceComponentData(path.slice(2), s.data?.[path[0]][path[1]], changes)
        })
      )
    }
  }
})

export const makeMoveComponentChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<Path[]>, 'handler'>
): void =>
  makeChange({ ...change, handler: DesignerComponentBaseHistoryEvents.MOVE_COMPONENT_DATA })

export const makeAddComponentChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData>, 'handler'>
): void => makeChange({ ...change, handler: DesignerComponentBaseHistoryEvents.ADD_COMPONENT_DATA })

export const makeDeleteComponentChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData>, 'handler'>
): void =>
  makeChange({ ...change, handler: DesignerComponentDeleteHistoryEvents.DELETE_COMPONENT_DATA })

export const makeCreateCustomComponentChange = (
  change: Omit<HistoryEventChangeWithAdditionalHandler<ComponentData>, 'handler'>
): void =>
  makeChange({
    ...change,
    handler: DesignerComponentCreateCustomHistoryEvents.CREATE_CUSTOM_COMPONENT
  })
