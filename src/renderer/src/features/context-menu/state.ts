import { createStore, produce } from 'solid-js/store'

export interface ContextMenuEntry {
  label: string
  action: () => void
}

export interface ContextMenuState {
  open: boolean
  x: number
  y: number
  entries: ContextMenuEntry[]
}

export const [contextMenu, setContextMenu] = createStore<ContextMenuState>({
  open: false,
  x: 0,
  y: 0,
  entries: []
})

export default contextMenu

export const showContextMenu = (x: number, y: number, entries: ContextMenuEntry[]): void => {
  setContextMenu(
    produce((state) => {
      state.open = true
      state.x = x
      state.y = y
      state.entries = entries
    })
  )
}

export const hideContextMenu = (): void => {
  setContextMenu(
    produce((state) => {
      state.open = false
    })
  )
}
