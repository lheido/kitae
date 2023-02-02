import { GestureEvent, Pan, PointerListener } from 'contactjs'
import { Component, ComponentProps, createEffect, onCleanup, Show, useContext } from 'solid-js'
import { produce } from 'solid-js/store'
import { Portal } from 'solid-js/web'
import { DnDContext } from './dnd.context'
import { Draggable, Droppable, DroppableElement } from './types'

export const draggable = (
  elt: HTMLElement,
  accessor: () => Draggable | (() => Draggable)
): void => {
  const [state, setState] = useContext(DnDContext)
  new PointerListener(elt, {
    supportedGestures: [Pan]
  })
  const onPanStart = (e: GestureEvent): void => {
    e.preventDefault()
    setState(
      produce((s) => {
        s.position = e.detail.global.center
        const acc = accessor()
        s.dragged = typeof acc === 'function' ? acc() : acc
      })
    )
  }
  const onPanMove = (e: GestureEvent): void => {
    e.preventDefault()
    const closest = state
      .droppables!.filter((d) => d.droppable.id !== state.dragged!.id)
      .reduce(
        (acc: { dist: number; d?: Droppable }, d) => {
          const rect = d.getBoundingClientRect()
          const dist = Math.abs(e.detail.global.center.y - rect.y)
          const inside =
            e.detail.global.center.x > rect.x && e.detail.global.center.x < rect.x + rect.width
          return inside && dist < acc.dist ? { dist, d: d.droppable } : acc
        },
        { dist: Infinity }
      )
    if (closest.d !== undefined) {
      setState('droppable', JSON.parse(JSON.stringify(closest.d)))
    } else {
      setState('droppable', undefined)
    }
    setState('position', e.detail.global.center)
  }
  const onPanEnd = (e: GestureEvent): void => {
    e.preventDefault()
    setState(
      produce((s) => {
        s.dragged = undefined
        s.droppable = undefined
      })
    )
  }
  elt.addEventListener('panstart', onPanStart as never)
  elt.addEventListener('pan', onPanMove as never)
  elt.addEventListener('panend', onPanEnd as never)
  onCleanup(() => {
    elt.removeEventListener('panstart', onPanStart as never)
    elt.removeEventListener('pan', onPanMove as never)
    elt.removeEventListener('panend', onPanEnd as never)
  })
}

export const droppable = (elt: Element, accessor: () => Droppable): void => {
  const [, setState] = useContext(DnDContext)
  createEffect(() => {
    setState(
      produce((s) => {
        let e = s.droppables?.find((d) => d === elt)
        if (e === undefined) {
          e = elt as DroppableElement
          s.droppables!.push(e)
        }
        e!.droppable = accessor()
      })
    )
  })
}

export type DragOverlayProps = ComponentProps<'div'>

export const DragOverlay: Component<DragOverlayProps> = (props: DragOverlayProps) => {
  const [state] = useContext(DnDContext)

  return (
    <Show when={state.dragged !== undefined}>
      <Portal mount={document.body}>
        <div
          class="absolute z-20"
          style={{
            top: `${state.position?.y}px`,
            left: `${state.position?.x}px`
          }}
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  )
}
