import { openLocalWorkspaceHandler } from '@renderer/features/api'
import { navigate } from '@renderer/features/router'
import { openWorkspace, workspacesState } from '@renderer/features/workspaces'
import { Component, createSignal, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import Button from './Button'
import Icon from './Icon'

const WorkspacesMenu: Component = () => {
  const [opened, open] = createSignal(false)
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  let buttonRef: HTMLButtonElement | undefined
  onMount(() => {
    const rect = buttonRef?.getBoundingClientRect()
    if (rect) {
      setPosition({ x: rect.x, y: rect.height + 8 })
    }
  })
  return (
    <div class="relative">
      <Button
        ref={buttonRef}
        title="Workspaces"
        class="btn-secondary rounded-none text-sm no-drag"
        onClick={(): void => {
          open((prev) => !prev)
        }}
      >
        <span class="text-ellipsis whitespace-nowrap overflow-hidden max-w-xs capitalize">
          {workspacesState.currentWorkspace?.name.replaceAll('-', ' ')}
        </span>
      </Button>
      <Show when={opened()}>
        <Portal mount={document.body}>
          <div
            class="fixed z-20 top-0 left-0 right-0 bottom-0"
            onClick={(): void => {
              open(false)
            }}
          />
          <div
            style={{
              top: `${position().y}px`,
              left: `${position().x}px`
            }}
            class="fixed z-20 w-80 bg-base-100 border border-secondary rounded-lg"
          >
            <ul class="flex flex-col gap-1 p-1">
              <li>
                <Button
                  class="w-full"
                  onClick={(): void => {
                    openLocalWorkspaceHandler()
                    open(false)
                  }}
                >
                  <span class="flex-1">Open local workspace</span>
                </Button>
              </li>
              <li>
                <Button
                  class="w-full"
                  onClick={(): void => {
                    openWorkspace(undefined)
                    navigate('workspaces')
                  }}
                >
                  <span class="flex-1">Back to workspaces</span>
                  <Icon icon="arrow-sm-right" />
                </Button>
              </li>
            </ul>
          </div>
        </Portal>
      </Show>
    </div>
  )
}

export default WorkspacesMenu
