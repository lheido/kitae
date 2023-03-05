import { Accessor, Component, createSignal, onCleanup } from 'solid-js'
import { createStore, produce, SetStoreFunction } from 'solid-js/store'
import { Draggable, Droppable } from './types'

export interface DndState {
  droppable?: Droppable
  draggable?: Draggable
  draggableElt?: HTMLElement
  position?: { x: number; y: number; eventX: number; eventY: number }
  index?: number
}

export interface DropEvent {
  droppable: Droppable
  data: DataTransfer
  index: number
}

const [dnd, setState] = createStore<DndState>({
  draggable: undefined,
  droppable: undefined,
  index: 0
})

const [onDrop, emitDropEvent] = createSignal<DropEvent | undefined>(undefined, {
  equals: () => false
})

export const useDnD = (): [
  DndState,
  SetStoreFunction<DndState>,
  Accessor<DropEvent | undefined>
] => [dnd, setState, onDrop]

export const draggable = (
  elt: HTMLElement,
  accessor: () => Draggable | (() => Draggable)
): void => {
  const dragStartHandler = (e: DragEvent): void => {
    const acc = accessor()
    const draggable = typeof acc === 'function' ? acc() : acc
    if (draggable !== undefined) {
      e.dataTransfer!.setData(draggable.format, JSON.stringify(draggable))
    }
    e.dataTransfer!.dropEffect = draggable.effect ?? 'move'
    e.dataTransfer!.effectAllowed = draggable.effect ?? 'move'
    setState(
      produce((s) => {
        s.draggable = draggable
        s.draggableElt = elt
      })
    )
  }
  const dragEndHandler = (): void => {
    setState('draggable', undefined)
    setState('droppable', undefined)
  }
  elt.setAttribute('draggable', 'true')
  elt.addEventListener('dragstart', dragStartHandler)
  elt.addEventListener('dragend', dragEndHandler)
  onCleanup(() => {
    elt.removeAttribute('draggable')
    elt.removeEventListener('dragstart', dragStartHandler)
    elt.removeEventListener('dragend', dragEndHandler)
  })
}

export const droppable = (elt: HTMLElement, accessor: () => Droppable): void => {
  elt.setAttribute('droppable', 'true')
  const dropHandler = (e: DragEvent): void => {
    e.preventDefault()
    // Required for nested droppables
    e.stopPropagation()
    const acc = accessor() as Droppable
    if (acc.enabled) {
      emitDropEvent(() => ({
        droppable: JSON.parse(JSON.stringify(acc)),
        index: dnd.index as number,
        data: e.dataTransfer!
      }))
      setState('droppable', undefined)
      setState('draggable', undefined)
    }
  }
  const dragOverHandler = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    const acc = accessor()
    const container = acc.container ?? elt
    const children = Array.from(container.children) as HTMLElement[]
    if (children.length > 0) {
      const closest = children
        .filter((c) => c instanceof HTMLLIElement)
        .reduce(
          (acc: { dist: number; elt: HTMLElement | undefined }, elt: HTMLElement) => {
            const rect = elt.getBoundingClientRect()
            const dist = Math.abs(rect.top - e.clientY)
            return dist < acc.dist ? { dist, elt } : acc
          },
          { dist: Infinity, elt: undefined } as { dist: number; elt: HTMLElement | undefined }
        )
      setState(
        produce((s) => {
          if (closest.elt !== undefined) {
            const rect = closest.elt.getBoundingClientRect()
            if (e.clientY < rect.top + rect.height / 2) {
              s.index = children.indexOf(closest.elt)
              s.position = {
                x: acc.x ?? e.clientX,
                y: rect.top,
                eventX: e.clientX,
                eventY: e.clientY
              }
            } else {
              s.index = children.indexOf(closest.elt) + 1
              s.position = {
                x: acc.x ?? e.clientX,
                y: rect.bottom,
                eventX: e.clientX,
                eventY: e.clientY
              }
            }
          }
        })
      )
    } else {
      setState(
        produce((s) => {
          s.index = 0
          const rect = container.getBoundingClientRect()
          s.position = { x: acc.x ?? e.clientX, y: rect.top, eventX: e.clientX, eventY: e.clientY }
        })
      )
    }
    if (acc.enabled) {
      setState('droppable', acc)
      e.dataTransfer!.dropEffect = dnd.draggable?.effect ?? 'move'
    } else {
      setState('droppable', undefined)
      e.dataTransfer!.dropEffect = 'none'
      e.dataTransfer!.effectAllowed = 'none'
    }
  }
  elt.addEventListener('dragover', dragOverHandler)
  elt.addEventListener('drop', dropHandler)
  onCleanup(() => {
    elt.removeAttribute('droppable')
    elt.removeEventListener('dragover', dragOverHandler)
    elt.removeEventListener('drop', dropHandler)
  })
}

export interface DragPlaceholderProps {
  position: { x: number; y: number }
  offsetTop: number
}

export const DragPlaceholder: Component<DragPlaceholderProps> = (props: DragPlaceholderProps) => {
  let ref: HTMLDivElement | undefined
  return (
    <div
      ref={ref}
      aria-hidden="true"
      class="absolute z-[201] h-1 -translate-y-1/2 right-0 bg-secondary pointer-events-none rounded"
      style={{
        transition: 'left 150ms',
        top: `${props.position.y - props.offsetTop}px`,
        left: `${props.position.x}px`
      }}
    />
  )
}

if (document.body) {
  // Make sure to reset the dnd state for global drag and drop events (from outside the app)
  // @TODO: For now, we can't use dropEffect 'none' because it prevent the drop event
  document.body.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  document.body.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()
    setState(
      produce((s) => {
        s.draggable = undefined
        s.droppable = undefined
        s.position = undefined
      })
    )
  })
}
