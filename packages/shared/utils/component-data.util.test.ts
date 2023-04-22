import { describe, expect, it } from 'vitest'
import { customComponentSlotId, mockWorkspaceDataWithPage, pageComponents } from '../test'
import {
  getComponentData,
  insertComponentData,
  moveComponentData,
  removeComponentData,
  replaceComponentData,
  walkComponentData
} from './component-data.util'

describe('component-data.util', () => {
  describe('walkComponentData', () => {
    it('should walk trough all the component in the given tree', () => {
      let count = 0
      walkComponentData(mockWorkspaceDataWithPage.pages[0], () => {
        count++
      })
      expect(count).toBe(Object.keys(pageComponents).length)
    })

    it('should stop when the callback returns true', () => {
      let count = 0
      walkComponentData(mockWorkspaceDataWithPage.pages[0], () => {
        count++
        return true
      })
      expect(count).toBe(1)
    })

    it('should pass the path to the callback', () => {
      walkComponentData(mockWorkspaceDataWithPage.pages[0], (node, path) => {
        if (node?.id === pageComponents.content.id) {
          expect(path).toEqual(['children', 1, 'children', 0, 'children', 0])
          return true
        }
        return false
      })
    })

    it('should pass the parent to the callback', () => {
      walkComponentData(mockWorkspaceDataWithPage.pages[0], (node, _, parent) => {
        if (node?.id === pageComponents.content.id) {
          expect(parent).toBeDefined()
          expect(parent?.id).toBe(pageComponents.container.id)
          return true
        }
        return false
      })
    })
  })

  describe('getComponentData', () => {
    it('should return the component data for the given path', () => {
      const path = ['children', 0, 'children', 0]
      const componentData = getComponentData(path, mockWorkspaceDataWithPage.pages[0])
      expect(componentData).toEqual(mockWorkspaceDataWithPage.pages[0].children![0].children![0])
      const pageComponent = getComponentData(['pages', 0], mockWorkspaceDataWithPage)
      expect(pageComponent).toEqual(mockWorkspaceDataWithPage.pages[0])
    })

    it('should return the component data for the given path with slot', () => {
      const path = ['children', 2, 'children', 0, 'slots', customComponentSlotId, 0]
      const componentData = getComponentData(path, mockWorkspaceDataWithPage.pages[0])
      expect(componentData).toEqual(
        mockWorkspaceDataWithPage.pages[0].children![2].children![0].slots![
          customComponentSlotId
        ][0]
      )
    })

    it('should return undefined if no component found', () => {
      const path = ['children', 0, 'children', 0, 'children', 0]
      const componentData = getComponentData(path, mockWorkspaceDataWithPage.pages[0])
      expect(componentData).toBeUndefined()
    })
  })

  describe('removeComponentData', () => {
    it('should remove the component data for the given path', () => {
      const path = ['children', 0, 'children', 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const result = removeComponentData(path, page)
      expect(result).toBe(true)
    })

    it('should remove the component data for the given path with slot', () => {
      const path = ['children', 2, 'children', 0, 'slots', customComponentSlotId, 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const result = removeComponentData(path, page)
      expect(result).toBe(true)
    })

    it('should return false if no component found', () => {
      const path = ['children', 42]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const result = removeComponentData(path, page)
      expect(result).toBe(false)
    })
  })

  describe('insertComponentData', () => {
    it('should insert the component data for the given path [children, 1, children, 0]', () => {
      const path = ['children', 1, 'children', 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const newComponent = {
        id: crypto.randomUUID(),
        name: 'New Component',
        type: 'container',
        children: [],
        config: []
      }
      const originalLength = page.children![1].children!.length
      const result = insertComponentData(path, page, newComponent)
      expect(result).toBe(true)
      expect(page.children![1].children![0]).toEqual(newComponent)
      expect(page.children![1].children!.length).toEqual(originalLength + 1)
    })

    it('should insert the component data for the given path [children, 0, children, 1]', () => {
      const path = ['children', 0, 'children', 1]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const newComponent = {
        id: crypto.randomUUID(),
        name: 'New Component',
        type: 'container',
        children: [],
        config: []
      }
      const originalLength = page.children![0].children!.length
      const result = insertComponentData(path, page, newComponent)
      expect(result).toBe(true)
      expect(page.children![0].children![1]).toEqual(newComponent)
      expect(page.children![0].children!.length).toEqual(originalLength + 1)
    })

    it('should insert the component data for the given path [children, 2]', () => {
      const path = ['children', 2]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const newComponent = {
        id: crypto.randomUUID(),
        name: 'New Component',
        type: 'container',
        children: [],
        config: []
      }
      const originalLength = page.children!.length
      const result = insertComponentData(path, page, newComponent)
      expect(result).toBe(true)
      expect(page.children![2]).toEqual(newComponent)
      expect(page.children!.length).toEqual(originalLength + 1)
    })

    it('should insert the component data for the given path with slot [children, 2, children, 0, slots, <id>, 0]', () => {
      const path = ['children', 2, 'children', 0, 'slots', customComponentSlotId, 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const newComponent = {
        id: crypto.randomUUID(),
        name: 'New Component',
        type: 'container',
        children: [],
        config: []
      }
      const originalLength = page.children![2].children![0].slots![customComponentSlotId].length
      const result = insertComponentData(path, page, newComponent)
      expect(result).toBe(true)
      expect(page.children![2].children![0].slots![customComponentSlotId][0]).toEqual(newComponent)
      expect(page.children![2].children![0].slots![customComponentSlotId].length).toEqual(
        originalLength + 1
      )
    })
  })

  describe('moveComponentData', () => {
    it('should move the component data for the given path [children, 0, children, 0] to [children, 1, children, 0]', () => {
      const fromPath = ['children', 0, 'children', 0]
      const toPath = ['children', 1, 'children', 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const originalLength = page.children![0].children!.length
      const originalTargetLength = page.children![1].children!.length
      const result = moveComponentData(fromPath, toPath, page)
      expect(result).toBe(true)
      expect(page.children![0].children!.length).toEqual(originalLength - 1)
      expect(page.children![1].children!.length).toEqual(originalTargetLength + 1)
    })

    it('should move the component data for the given path [children, 0] to [children, 2]', () => {
      const fromPath = ['children', 0]
      const toPath = ['children', 2]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const originalLength = page.children!.length
      const result = moveComponentData(fromPath, toPath, page)
      expect(result).toBe(true)
      expect(page.children!.length).toEqual(originalLength)
    })

    it('should move the component data for the given path [children, 2, children, 0, slots, <id>, 0] to [children, 2]', () => {
      const fromPath = ['children', 2, 'children', 0, 'slots', customComponentSlotId, 0]
      const toPath = ['children', 2]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const originalLength = page.children![2].children![0].slots![customComponentSlotId].length
      const originalTargetLength = page.children!.length
      const result = moveComponentData(fromPath, toPath, page)
      expect(result).toBe(true)
      expect(page.children![3].children![0].slots![customComponentSlotId].length).toEqual(
        originalLength - 1
      )
      expect(page.children!.length).toEqual(originalTargetLength + 1)
    })
  })

  describe('replaceComponentData', () => {
    it('should replace the component data for the given path [children, 0, children, 0]', () => {
      const path = ['children', 0, 'children', 0]
      const page = JSON.parse(JSON.stringify(mockWorkspaceDataWithPage.pages[0]))
      const newComponent = {
        id: crypto.randomUUID(),
        name: 'New Component',
        type: 'container',
        children: [],
        config: []
      }
      const result = replaceComponentData(path, page, newComponent)
      expect(result).toBe(true)
      expect(page.children![0].children![0]).toEqual(newComponent)
    })
  })
})
