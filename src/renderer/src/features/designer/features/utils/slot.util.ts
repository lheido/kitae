import { ComponentData } from '@kitae/shared/types'
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
