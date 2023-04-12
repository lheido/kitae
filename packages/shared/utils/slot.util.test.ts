import { describe, expect, it } from 'vitest'
import { customComponentData, customComponentSlotId, mockWorkspaceDataWithPage } from '../test'
import { ComponentData } from '../types'
import { getComponentData } from './component-data.util'
import { getSlots, replaceSlots } from './slot.util'

describe('slot.util', () => {
  describe('getSlots', () => {
    it('should return all the slots in the given tree', () => {
      const slots = getSlots(mockWorkspaceDataWithPage.components[0])
      expect(slots.length).toEqual(1)
      expect(slots[0].id).toEqual(customComponentSlotId)
    })

    it('should return an empty array if there is no slot in the given tree', () => {
      const slots = getSlots(mockWorkspaceDataWithPage.pages[0])
      expect(slots.length).toEqual(0)
    })
  })

  describe('replaceSlots', () => {
    it('should replace the slots with the given tree', () => {
      const customComponent = mockWorkspaceDataWithPage.components[0]
      const data = getComponentData<ComponentData>(
        ['children', 2, 'children', 0],
        mockWorkspaceDataWithPage.pages[0]
      )
      const replacedTree = replaceSlots(data!, customComponent)
      expect(replacedTree).toEqual({
        ...customComponentData,
        children: [
          ...(getComponentData<ComponentData[]>(
            ['children', 2, 'children', 0, 'slots', customComponentSlotId],
            mockWorkspaceDataWithPage.pages[0]
          ) ?? [])
        ]
      })
    })
  })
})
