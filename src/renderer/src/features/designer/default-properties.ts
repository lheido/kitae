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
    type: 'backgroundColor',
    data: 'None'
  },
  {
    type: 'color',
    data: 'None'
  }
]

export const defaultStateProperties: Partial<ComponentConfig>[] = [
  {
    type: 'hover',
    data: {
      config: []
    }
  },
  {
    type: 'active',
    data: {
      config: []
    }
  },
  {
    type: 'focus',
    data: {
      config: []
    }
  },
  {
    type: 'focus-within',
    data: {
      config: []
    }
  },
  {
    type: 'focus-visible',
    data: {
      config: []
    }
  },
  {
    type: 'disabled',
    data: {
      config: []
    }
  },
  {
    type: 'invalid',
    data: {
      config: []
    }
  },
  {
    type: 'link',
    data: {
      config: []
    }
  },
  {
    type: 'visited',
    data: {
      config: []
    }
  }
]
