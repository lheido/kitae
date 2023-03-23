import { ComponentData } from '@kitae/shared/types'
import { walkComponentData } from './component-data.util'

/**
 * Replace a children node with a ComponentData tree.
 * @param data ComponentData
 * @param tree ComponentData
 */
export const replaceChildren = (data: ComponentData, tree: ComponentData): void => {
  walkComponentData(tree, (node, p, parent) => {
    if (node.type === 'children' && parent) {
      parent.children!.splice(p[p.length - 1] as number, 1, ...data.children!)
      return true
    }
    return false
  })
}
