import { ComponentConfig } from '@kitae/shared/types'

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
    type: 'height',
    data: {}
  },
  {
    type: 'width',
    data: {}
  },
  {
    type: 'backgroundColor',
    data: ''
  },
  {
    type: 'color',
    data: ''
  },
  {
    type: 'rounded',
    data: {
      tr: 'rounded-none',
      tl: 'rounded-none',
      br: 'rounded-none',
      bl: 'rounded-none'
    }
  },
  {
    type: 'flex',
    data: {
      justify: 'start',
      align: 'start',
      direction: 'row',
      wrap: 'nowrap'
    }
  },
  {
    type: 'flexItem',
    data: {}
  },
  {
    type: 'gap',
    data: {
      x: 0,
      y: 0
    }
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
