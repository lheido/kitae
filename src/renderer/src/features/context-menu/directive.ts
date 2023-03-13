import { createEffect, createSignal, onCleanup } from 'solid-js'
import contextMenu, { ContextMenuEntry, showContextMenu } from './state'

export interface ContextMenuAccessorData {
  entries: ContextMenuEntry[]
  onOpen?: (elt: HTMLElement) => void
  onClose?: (elt: HTMLElement) => void
}

export const contextmenu = (elt: HTMLElement, accessor: () => ContextMenuAccessorData): void => {
  const [isOpened, setIsOpened] = createSignal(false)
  const onContextMenu = (e: MouseEvent): void => {
    e.preventDefault()
    const { entries, onOpen } = accessor()
    if (entries.length === 0) return
    showContextMenu(e.clientX, e.clientY, entries)
    setIsOpened(true)
    if (onOpen) {
      onOpen(elt)
    }
  }
  createEffect(() => {
    if (!contextMenu.open && isOpened()) {
      setIsOpened(false)
      const { onClose } = accessor()
      if (onClose) {
        onClose(elt)
      }
    }
  })
  elt.addEventListener('contextmenu', onContextMenu)
  onCleanup(() => {
    elt.removeEventListener('contextmenu', onContextMenu)
  })
}
