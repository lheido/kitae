import { ComponentData } from '@kitae/shared/types'
import { registerHistoryEvents } from '@renderer/features/history'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'

const [, { updatePath }] = useDesignerState()

registerHistoryEvents({
  [DesignerHistoryHandlers.CREATE_CUSTOM_COMPONENT]: {
    execute: ({ path, changes }): void => {
      const customComponentData: ComponentData = {
        id: crypto.randomUUID(),
        type: 'custom',
        // TODO: Initialize with a more useful name
        name: 'Custom',
        children: [changes as ComponentData],
        config: []
      }
      const indexToReplace = path.at(-1) as number
      updatePath(['components'], (list: ComponentData[]) => {
        list.push(customComponentData)
      })
      updatePath(path.slice(0, -1), (list: ComponentData[]) => {
        list[indexToReplace] = {
          ...customComponentData,
          children: [],
          slots: {},
          ref: customComponentData.id,
          id: crypto.randomUUID()
        }
      })
    },
    undo: ({ path, changes }): void => {
      const indexToReplace = path.at(-1) as number
      updatePath(['components'], (list: ComponentData[]) => {
        list.pop()
      })
      updatePath(path.slice(0, -1), (list: ComponentData[]) => {
        list[indexToReplace] = changes as ComponentData
      })
    }
  }
})
