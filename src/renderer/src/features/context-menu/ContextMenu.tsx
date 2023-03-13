import Button from '@renderer/components/Button'
import { Component, For, JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import contextMenu, { hideContextMenu } from './state'

const ContextMenu: Component = () => {
  return (
    <Portal mount={document.body}>
      <Show when={contextMenu.open}>
        <div
          class="absolute z-50 top-0 left-0 right-0 bottom-0"
          onClick={(): void => hideContextMenu()}
        />
        <section
          class="absolute z-50 bg-base-100 text-base-content rounded overflow-hidden min-w-[200px] border border-secondary"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <ul>
            <For each={contextMenu.entries}>
              {(entry): JSX.Element => (
                <li>
                  <Button
                    class="w-full"
                    onClick={(): void => {
                      entry.action()
                      hideContextMenu()
                    }}
                  >
                    {entry.label}
                  </Button>
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>
    </Portal>
  )
}

export default ContextMenu
