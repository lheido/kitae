import { ComponentData } from '@kitae/shared/types'
import './features/data/renderer'

interface PartialComponentData extends Omit<ComponentData, 'id' | 'children'> {
  id?: string
  children?: PartialComponentData[]
}

export const defaultComponents: PartialComponentData[] = [
  {
    name: 'Container',
    type: 'container',
    config: [],
    children: []
  },
  {
    name: 'Text',
    type: 'text',
    config: [
      {
        type: 'text',
        data: 'Lorem ipsum'
      },
      { type: 'semantic', data: 'p' }
    ]
  },
  {
    name: 'Button',
    type: 'button',
    config: [],
    children: []
  },
  {
    name: 'Section',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'section'
      }
    ],
    children: []
  },
  {
    name: 'Article',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'article'
      }
    ],
    children: []
  },
  {
    name: 'Aside',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'aside'
      }
    ],
    children: []
  },
  {
    name: 'Header',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'header'
      }
    ],
    children: []
  },
  {
    name: 'Footer',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'footer'
      }
    ],
    children: []
  },
  {
    name: 'Main',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'main'
      }
    ],
    children: []
  },
  {
    name: 'Slot',
    type: 'slot',
    config: [],
    children: []
  },
  {
    name: 'Children',
    type: 'children',
    config: [],
    children: []
  }
]
