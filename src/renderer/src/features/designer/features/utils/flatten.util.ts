import { ComponentData, Path } from '@kitae/shared/types'
import { FlatComponentData } from './types'

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
