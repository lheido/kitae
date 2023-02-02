import { Path } from '@kitae/shared/types'

export interface Draggable {
  id: string
  path: Path
  data?: unknown
}

export interface Droppable {
  id: string
  path: Path
  root: boolean
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
