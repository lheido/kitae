import { ComponentData, WorkspaceData } from '@kitae/shared/types'
import { walkComponentData } from './component-data.util'

/**
 * Find slot children in a ComponentData tree.
 * @param tree ComponentData
 */
export const getSlots = (tree: ComponentData): ComponentData[] => {
  const slots: ComponentData[] = []
  walkComponentData(tree, (node) => {
    if (node.type === 'slot') {
      slots.push(node)
    }
  })
  return slots
}

/**
 * Replace a slot with a ComponentData tree.
 * @param data ComponentData
 * @param tree ComponentData
 */
export const replaceSlots = (data: ComponentData, tree: ComponentData): ComponentData => {
  Object.entries(data.slots ?? {}).forEach(([id, children]) => {
    walkComponentData(tree, (node, p, parent) => {
      if (node.type === 'slot' && node.id === id && parent) {
        parent.children!.splice(p[p.length - 1] as number, 1, ...children)
        return true
      }
      return false
    })
  })
  return tree
}

export const cleanAndUpdateSlots = (custom: ComponentData, workspace: WorkspaceData): void => {
  // Remove old slot in the workspace pages according to the given custom component.
  // Also update the slots object with the new slot ids.
  ;[...workspace.pages, ...workspace.components].forEach((page) => {
    walkComponentData(page, (node) => {
      if (node.type === 'custom' && node.ref === custom.id) {
        const slots = getSlots(custom)
        Object.keys(node.slots ?? {}).forEach((id) => {
          if (!slots.find((slot) => slot.id === id)) {
            delete node.slots![id]
          }
        })
        slots.forEach((slot) => {
          if (!node.slots?.[slot.id]) {
            node.slots![slot.id] = []
          }
        })
      }
    })
  })
}
