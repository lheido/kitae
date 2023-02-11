import { Path } from '@kitae/shared/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exists = (tree: any, path: Path): boolean => {
  const current = path[0]
  if (tree[current]) {
    if (path.length === 1) {
      return true
    } else {
      return exists(tree[current], path.slice(1))
    }
  }
  return false
}
