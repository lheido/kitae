import { Path } from '@kitae/shared/types'
import { getComponentData } from './component-data.util'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const walker = <T>(tree: any, path: Path): T | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getComponentData<any>(path, tree)
}
