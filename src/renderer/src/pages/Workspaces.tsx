import { Workspace } from '@kitae/shared/types'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { moveWorkspaceAtFirst, openLocalWorkspaceHandler } from '@renderer/features/api'
import { navigate } from '@renderer/features/router'
import {
  fetchWorkspaces,
  openWorkspace,
  removeWorkspace,
  workspacesState
} from '@renderer/features/workspaces'
import { AnimationControls, timeline } from 'motion'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createEffect, createSignal, For, JSXElement, onMount } from 'solid-js'

interface WorkspaceItemProps {
  workspace: Workspace
}

const WorkspaceItem: Component<WorkspaceItemProps> = (props: WorkspaceItemProps) => {
  const removeHandler = (): void => {
    removeWorkspace(props.workspace.id)
  }
  return (
    <div class="group relative overflow-hidden w-full">
      <Button
        onClick={(): void => {
          openWorkspace(props.workspace.id)
          navigate('designer')
          moveWorkspaceAtFirst(props.workspace.id)
        }}
        class="btn-secondary bg-base-300 bg-opacity-30 flex-col w-full active:scale-[0.99] gap-1"
        title="Open workspace"
      >
        <span class="text-base capitalize">{props.workspace.name.replace('-', ' ')}</span>
        <span class="opacity-40 text-sm">
          {props.workspace.backends.reduce((acc, backend) => {
            if (!acc) {
              if (backend.name === 'local') {
                return backend.path
              }
            }
            return acc
          }, '')}
        </span>
      </Button>
      <Button
        onClick={removeHandler}
        class="btn-error btn-icon absolute top-1/2 right-3 -translate-y-1/2"
        title="Remove workspace"
      >
        <Icon icon="bin" />
      </Button>
    </div>
  )
}

const Workspaces: Component = () => {
  let headerContent: HTMLDivElement | undefined
  let headerTitle: HTMLHeadingElement | undefined
  let headerIcon: SVGSVGElement | undefined
  let animation: AnimationControls
  const headerHeight = 300
  const minHeaderHeight = 64

  const [scroll, setScroll] = createSignal<number>(0)

  onMount(() => {
    fetchWorkspaces()
    animation = timeline(
      [
        [
          headerContent as HTMLDivElement,
          {
            height: [null, `${minHeaderHeight}px`],
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
          }
        ],
        [
          headerTitle as HTMLHeadingElement,
          {
            top: [null, `${minHeaderHeight / 2}px`],
            left: [null, `${16 + 24 + 16}px`],
            fontSize: [null, '1.125rem'],
            lineHeight: [null, '1.75rem']
          },
          { at: '<' }
        ],
        [
          headerIcon as SVGSVGElement,
          {
            top: [null, `${minHeaderHeight / 2}px`],
            transform: [null, 'translateY(-50%) translateX(0) scale(1) rotate(0deg)'],
            opacity: [null, null, 1]
          },
          { at: '<' }
        ]
      ],
      { duration: 1, defaultOptions: {} }
    )
    animation.stop()
  })

  createEffect(() => {
    animation.currentTime = Math.max(1 - Math.max(headerHeight - scroll(), 0) / headerHeight, 0)
  })

  return (
    <OverlayScrollbarsComponent
      defer
      element="section"
      events={{ scroll: ({ elements }): number => setScroll(elements().viewport.scrollTop) }}
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      class="basis-2/3 h-4/5 xl:basis-1/2 xl:h-2/3 bg-base-200 rounded-lg"
    >
      <header class="sticky top-0 z-10">
        <div
          ref={headerContent}
          class="absolute bg-base-200 w-full overflow-hidden"
          style={{ height: `${headerHeight}px` }}
        >
          <Icon
            ref={headerIcon}
            icon="workspaces"
            class="absolute top-1/2 left-4 -translate-y-1/2 translate-x-[150%] scale-[10] rotate-12 opacity-5"
          />
          <h1 ref={headerTitle} class="text-3xl absolute top-1/2 left-32 -translate-y-1/2">
            Workspaces
          </h1>
          <Button
            color="secondary"
            title="Open local workspace"
            onClick={(): void => {
              openLocalWorkspaceHandler()
            }}
            class="btn-secondary btn-icon absolute top-1/2 right-4 -translate-y-1/2"
          >
            <Icon icon="add-workspace" />
          </Button>
        </div>
      </header>
      <div class="p-4 h-[150%]" style={{ 'margin-top': `${headerHeight}px` }}>
        <ul class="flex flex-col gap-2">
          <For each={workspacesState.workspaces} fallback={<li>No workspace found.</li>}>
            {(workspace): JSXElement => (
              <li>
                <WorkspaceItem workspace={workspace} />
              </li>
            )}
          </For>
        </ul>
      </div>
    </OverlayScrollbarsComponent>
  )
}

export default Workspaces
