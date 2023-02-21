import { ComponentConfig } from '@kitae/shared/types'
import './features/data/renderer'
import './features/properties/renderer'

export const defaultProperties: Partial<ComponentConfig>[] = [
  {
    type: 'padding',
    data: {}
  },
  {
    type: 'margin',
    data: {}
  },
  {
    type: 'bg-color',
    data: {}
  },
  {
    type: 'color',
    data: {}
  }
]
