import { ComponentData, Path, WorkspaceData } from '@kitae/shared/types'

/**
 * Walk through the given component data tree and call a callback for each element.
 */
export const walkComponentData = (
  tree: ComponentData,
  callback: (data: ComponentData, path: Path, parent?: ComponentData) => boolean | void,
  path?: Path,
  parent?: ComponentData
): boolean | void => {
  const shouldStop = callback(tree, path ?? [], parent)
  if (!shouldStop && tree.slots) {
    for (const i in tree.slots) {
      for (let j = 0; j < tree.slots[i].length; j++) {
        if (walkComponentData(tree.slots[i][j], callback, [...(path ?? []), 'slots', i, j], tree)) {
          return true
        }
      }
    }
  }
  if (!shouldStop && tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (walkComponentData(tree.children[i], callback, [...(path ?? []), 'children', i], tree)) {
        return true
      }
    }
  }
  return shouldStop
}

export const reverseWalkComponentData = (
  path: Path,
  tree: ComponentData | WorkspaceData,
  callback: (component?: ComponentData) => boolean | void
): boolean | void => {
  const component = getComponentData<ComponentData>(path, tree)
  const shouldStop = callback(component)
  const parentPath = path.slice(0, -2) // remove the index and children/slots
  if (!shouldStop && parentPath.length > 0) {
    return reverseWalkComponentData(parentPath, tree, callback)
  }
  return shouldStop
}

export const getComponentData = <T>(
  path: Path,
  tree: ComponentData | WorkspaceData
): T | undefined => {
  const current = path[0]
  if (current in tree && tree[current]) {
    if (path.length === 1) {
      return tree[current] as T
    } else {
      return getComponentData(path.slice(1), tree[current] as ComponentData)
    }
  }
  return undefined
}

export const removeComponentData = (path: Path, tree: ComponentData): boolean => {
  const index = path[path.length - 1] as number
  const parent =
    getComponentData<ComponentData[]>(path.slice(0, -1), tree) ?? ([] as ComponentData[])
  if (parent) {
    const result = parent?.splice(index, 1)
    return result.length === 1
  }
  return false
}

export const insertComponentData = <T>(path: Path, tree: ComponentData, data: T): boolean => {
  const index = path[path.length - 1] as number
  const parent = getComponentData<T[]>(path.slice(0, -1), tree) ?? ([] as T[])
  if (parent) {
    parent?.splice(index, 0, data)
    return true
  }
  return false
}

export const replaceComponentData = <T>(path: Path, tree: ComponentData, data: T): boolean => {
  const index = path[path.length - 1] as number
  const parent = getComponentData<T[]>(path.slice(0, -1), tree) ?? ([] as T[])
  if (parent) {
    parent?.splice(index, 1, data)
    return true
  }
  return false
}

/**
 * Move a component data at the given path to a new path.
 */
export const moveComponentData = (from: Path, to: Path, tree: ComponentData): boolean => {
  const data = getComponentData<ComponentData>(from, tree)
  if (data) {
    if (removeComponentData(from, tree)) {
      return insertComponentData(to, tree, data)
    }
  }
  return false
}
