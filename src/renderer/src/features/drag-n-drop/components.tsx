// import { GestureEvent, Pan, PointerListener } from 'contactjs'

import { Accessor, Component, createSignal, onCleanup } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { Draggable, Droppable } from './types'

// export const draggable = (
//   elt: HTMLElement,
//   accessor: () => Draggable | (() => Draggable)
// ): void => {
//   const [state, setState] = useContext(DnDContext)
//   new PointerListener(elt, {
//     supportedGestures: [Pan]
//   })
//   const onPanStart = (e: GestureEvent): void => {
//     e.preventDefault()
//     setState(
//       produce((s) => {
//         s.position = e.detail.global.center
//         const acc = accessor()
//         s.dragged = typeof acc === 'function' ? acc() : acc
//       })
//     )
//   }
//   const onPanMove = (e: GestureEvent): void => {
//     e.preventDefault()
//     const closest = state
//       .droppables!.filter((d) => d.droppable.id !== state.dragged!.id)
//       .reduce(
//         (acc: { dist: number; d?: Droppable }, d) => {
//           const rect = d.getBoundingClientRect()
//           const dist = Math.abs(e.detail.global.center.y - rect.y)
//           const inside =
//             e.detail.global.center.x > rect.x && e.detail.global.center.x < rect.x + rect.width
//           return inside && dist < acc.dist ? { dist, d: d.droppable } : acc
//         },
//         { dist: Infinity }
//       )
//     if (closest.d !== undefined) {
//       setState('droppable', JSON.parse(JSON.stringify(closest.d)))
//     } else {
//       setState('droppable', undefined)
//     }
//     setState('position', e.detail.global.center)
//   }
//   const onPanEnd = (e: GestureEvent): void => {
//     e.preventDefault()
//     setState(
//       produce((s) => {
//         s.dragged = undefined
//         s.droppable = undefined
//       })
//     )
//   }
//   elt.addEventListener('panstart', onPanStart as never)
//   elt.addEventListener('pan', onPanMove as never)
//   elt.addEventListener('panend', onPanEnd as never)
//   onCleanup(() => {
//     elt.removeEventListener('panstart', onPanStart as never)
//     elt.removeEventListener('pan', onPanMove as never)
//     elt.removeEventListener('panend', onPanEnd as never)
//   })
// }

// export const droppable = (elt: Element, accessor: () => Droppable): void => {
//   const [, setState] = useContext(DnDContext)
//   createEffect(() => {
//     setState(
//       produce((s) => {
//         let e = s.droppables?.find((d) => d === elt)
//         if (e === undefined) {
//           e = elt as DroppableElement
//           s.droppables!.push(e)
//         }
//         e!.droppable = accessor()
//       })
//     )
//   })
// }

// export type DragOverlayProps = ComponentProps<'div'>

// export const DragOverlay: Component<DragOverlayProps> = (props: DragOverlayProps) => {
//   const [state] = useContext(DnDContext)

//   return (
//     <Show when={state.dragged !== undefined}>
//       <Portal mount={document.body}>
//         <div
//           class="absolute z-20"
//           style={{
//             top: `${state.position?.y}px`,
//             left: `${state.position?.x}px`
//           }}
//         >
//           {props.children}
//         </div>
//       </Portal>
//     </Show>
//   )
// }

// const [dragged, setDragged] = createSignal<Draggable | undefined>(undefined)
export interface DndState {
  droppable?: Droppable
  draggable?: Draggable
  position?: { x: number; y: number }
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
    setState('draggable', draggable)
  }
  const dragEndHandler = (): void => {
    setState('draggable', undefined)
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

    emitDropEvent(() => ({
      droppable: JSON.parse(JSON.stringify(acc)),
      index: dnd.index as number,
      data: e.dataTransfer!
    }))
    setState('droppable', undefined)
    setState('draggable', undefined)
  }
  const dragOverHandler = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer!.dropEffect = dnd.draggable?.effect ?? 'move'
    setState('position', { x: e.clientX, y: e.clientY })
  }
  const dragEnterHandler = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    const acc = accessor()
    setState('droppable', acc)
  }
  const dragLeaveHandler = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    const acc = accessor()
    if (dnd.droppable?.id === acc?.id) {
      setState('droppable', undefined)
    }
  }
  elt.addEventListener('dragover', dragOverHandler)
  elt.addEventListener('drop', dropHandler)
  elt.addEventListener('dragenter', dragEnterHandler)
  elt.addEventListener('dragleave', dragLeaveHandler)
  onCleanup(() => {
    elt.removeAttribute('droppable')
    elt.removeEventListener('dragover', dragOverHandler)
    elt.removeEventListener('drop', dropHandler)
    elt.removeEventListener('dragenter', dragEnterHandler)
    elt.removeEventListener('dragleave', dragLeaveHandler)
  })
}

export interface DragPlaceholderProps {
  position: { x: number; y: number }
}

export const DragPlaceholder: Component<DragPlaceholderProps> = (props: DragPlaceholderProps) => {
  return (
    <div
      aria-hidden="true"
      class="absolute z-10 h-1 right-0 bg-secondary pointer-events-none rounded"
      style={{
        top: `${props.position.y}px`,
        left: `${props.position.x}px`
      }}
    />
  )
}
