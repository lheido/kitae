import { ComponentData, Path } from '@kitae/shared/types'
import { FlatComponentData } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const walker = <T>(tree: any, path: Path): T | undefined => {
  const current = path[0]
  if (tree[current]) {
    if (path.length === 1) {
      return tree[current]
    } else {
      return walker(tree[current], path.slice(1))
    }
  }
  return undefined
}

export const samePath = (path1: Path, path2: Path): boolean => {
  if (path1.length !== path2.length) {
    return false
  }
  return path1.every((value, index) => value === path2[index])
}

export const flattenComponentData = (
  data: ComponentData,
  path: Path,
  depth = 0
): FlatComponentData[] => {
  const result: FlatComponentData[] = []
  const walk = (data: ComponentData, p: Path, d: number): void => {
    result.push({ ...data, path: p, depth: d, children: undefined })
    if (data.children) data.children.forEach((c, i) => walk(c, [...p, 'children', i], d + 1))
  }
  walk(data, path, depth)
  return result
}
