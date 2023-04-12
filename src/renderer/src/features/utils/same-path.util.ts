import { Path } from '@kitae/shared/types'

export const samePath = (path1: Path, path2: Path): boolean => {
  if (path1.length !== path2.length) {
    return false
  }
  return path1.every((value, index) => value === path2[index])
}
