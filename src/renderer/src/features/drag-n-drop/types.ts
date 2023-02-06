import { Path } from '@kitae/shared/types'

export interface Draggable {
  format: string
  effect?: 'copy' | 'move' | 'link'
  id: string
  path: Path
  data?: unknown
}

export interface Droppable {
  id: string
  path: Path
  allowedEffects: string[]
}

export interface DroppableElement extends HTMLElement {
  droppable: Droppable
}

export interface DnDState {
  dragged?: Draggable
  droppable?: Droppable
  droppables?: DroppableElement[]
  position?: { x: number; y: number }
}
