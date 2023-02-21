import { ComponentData } from '@kitae/shared/types'
import './features/data/renderer'
import './features/properties/renderer'

export const defaultComponents: Partial<ComponentData>[] = [
  {
    name: 'Container',
    type: 'container',
    config: {},
    children: []
  },
  {
    name: 'Text',
    type: 'text',
    config: {
      text: 'Lorem ipsum'
    }
  },
  {
    name: 'Paragraph',
    type: 'container',
    config: {
      semantic: 'p'
    },
    children: []
  },
  {
    name: 'Button',
    type: 'button',
    config: {},
    children: []
  },
  {
    name: 'Section',
    type: 'container',
    config: {
      semantic: 'section'
    },
    children: []
  },
  {
    name: 'Article',
    type: 'container',
    config: {
      semantic: 'article'
    },
    children: []
  },
  {
    name: 'Aside',
    type: 'container',
    config: {
      semantic: 'aside'
    },
    children: []
  },
  {
    name: 'Header',
    type: 'container',
    config: {
      semantic: 'header'
    },
    children: []
  },
  {
    name: 'Footer',
    type: 'container',
    config: {
      semantic: 'footer'
    },
    children: []
  },
  {
    name: 'Main',
    type: 'container',
    config: {
      semantic: 'main'
    },
    children: []
  }
]
