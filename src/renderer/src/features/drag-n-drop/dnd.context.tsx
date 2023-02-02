import { Component, ComponentProps, createContext, createEffect } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { DnDState, Draggable, Droppable } from './types'

export const DnDContext = createContext<[DnDState, SetStoreFunction<DnDState>]>([
  {},
  (): void => {}
])

export interface OnDroppedParam {
  draggable: Draggable
  droppable?: Droppable
}

export interface DnDProviderProps extends ComponentProps<'div'> {
  onDropped: (data: OnDroppedParam) => void
}

export const DnDProvider: Component<DnDProviderProps> = (props: DnDProviderProps) => {
  const [state, setState] = createStore<DnDState>({
    dragged: undefined,
    droppables: []
  })
  createEffect((prev?: OnDroppedParam) => {
    if (prev !== undefined && state.dragged === undefined) {
      props.onDropped(prev)
    }
    return { draggable: state.dragged, droppable: state.droppable } as OnDroppedParam
  })
  return <DnDContext.Provider value={[state, setState]}>{props.children}</DnDContext.Provider>
}
