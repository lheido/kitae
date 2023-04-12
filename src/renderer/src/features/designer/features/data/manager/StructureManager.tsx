import { ComponentData, Path } from '@kitae/shared/types'
import { getSlots, samePath, walker } from '@kitae/shared/utils'
import Badge from '@renderer/components/Badge'
import Icon from '@renderer/components/Icon'
import { contextmenu } from '@renderer/features/context-menu'
import { componentTypeIconMap } from '@renderer/features/designer/icon-map'
import {
  DragPlaceholder,
  Draggable,
  draggable,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import {
  Component,
  ComponentProps,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  splitProps
} from 'solid-js'
import { twMerge } from 'tailwind-merge'
import {
  makeAddComponentChange,
  makeCreateCustomComponentChange,
  makeDeleteComponentChange,
  makeMoveComponentChange
} from '../../history/component.events'
import { useDesignerState } from '../../state/designer.state'

!!droppable && false
!!draggable && false
!!contextmenu && false

const [state, { navigate }] = useDesignerState()

interface RecursiveComponentItemProps extends ComponentProps<'button'> {
  path: Path
  data: ComponentData
  depth: number
  disableDrop?: boolean
}

const RecursiveComponentItem: Component<RecursiveComponentItemProps> = (
  props: RecursiveComponentItemProps
) => {
  let containerRef: HTMLUListElement | undefined
  let slotContainerRef: HTMLUListElement | undefined
  const [component, classes, button] = splitProps(
    props,
    ['path', 'data', 'depth', 'disableDrop'],
    ['class']
  )
  const [dnd] = useDnD()
  const isActive = createMemo(() => samePath(state.current, component.path))
  const leftPadding = createMemo(() => {
    return component.depth * 16 + 8
  })
  const isDropEnabled = createMemo(
    () =>
      !component.disableDrop &&
      dnd.draggable?.id !== component.data.id &&
      component.data.children !== undefined
  )
  const deleteComponent = (): void => {
    const p: Path = JSON.parse(JSON.stringify(component.path))
    const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
    const isSelected = JSON.parse(JSON.stringify(isActive()))
    makeDeleteComponentChange({
      path: p,
      changes: previous,
      afterExecute: (): void => {
        if (isSelected) {
          navigate(p.slice(0, -2))
        }
      },
      afterUndo: (): void => {
        if (isSelected) {
          navigate(p)
        }
      }
    })
  }
  const createComponentFromThis = (): void => {
    const p: Path = JSON.parse(JSON.stringify(component.path))
    const componentData = JSON.parse(JSON.stringify(walker(state.data, p)))
    makeCreateCustomComponentChange({
      path: p,
      changes: componentData
    })
  }
  const clickHandler = (): void => {
    navigate(component.path)
  }
  const contextMenuEntries = createMemo(() => {
    return [
      {
        label: 'Delete',
        action: deleteComponent
      },
      {
        label: 'Create component from this',
        action: createComponentFromThis
      }
    ]
  })
  const slots = createMemo(() => {
    if (component.data.type !== 'custom') return []
    const originalComponent = state.data?.components?.find((c) => c.id === component.data.ref)
    if (!originalComponent) return []
    return getSlots(originalComponent)
  })
  return (
    <li
      classList={{
        'opacity-25': dnd.draggable?.id === component.data.id
      }}
      // @ts-ignore - directive
      // eslint-disable-next-line solid/jsx-no-undef
      use:droppable={{
        enabled: isDropEnabled(),
        id: component.data.id,
        path: component.path,
        root: false,
        x: leftPadding() + 16,
        container: containerRef
      }}
    >
      <button
        class={twMerge(
          'flex px-2 gap-2 py-1 w-full rounded items-center text-left whitespace-nowrap',
          'border border-transparent bg-base-200',
          'hover:bg-secondary-focus hover:bg-opacity-30',
          'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30',
          classes.class
        )}
        classList={{
          '!border-secondary': isActive()
        }}
        style={{
          'padding-left': `${leftPadding()}px`
        }}
        onClick={clickHandler}
        {...button}
        // @ts-ignore - directive
        // eslint-disable-next-line solid/jsx-no-undef
        use:draggable={{
          format: 'kitae/move-component',
          effect: 'move',
          id: component.data.id,
          path: component.path,
          enabled: true
        }}
        use:contextmenu={{
          entries: contextMenuEntries(),
          onOpen: (elt: HTMLElement): void => {
            if (!isActive()) {
              elt.classList.add('!border-secondary')
            }
            elt.classList.add('!border-opacity-25')
          },
          onClose: (elt: HTMLElement): void => {
            if (!isActive()) {
              elt.classList.remove('!border-secondary')
            }
            elt.classList.remove('!border-opacity-25')
          }
        }}
      >
        <Icon icon={componentTypeIconMap[component.data.type]} class="w-3 h-3 opacity-50" />
        <span class="flex-1 max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
          {component.data.name}
        </span>
      </button>
      <Show when={slots().length > 0}>
        <ul class="relative flex flex-col gap-0.5 pb-1">
          <For each={slots()}>
            {(slot): JSX.Element => (
              <li>
                <div
                  class="flex items-center px-2 gap-2 py-1 w-full opacity-70"
                  style={{
                    'padding-left': `${leftPadding() + 16}px`
                  }}
                >
                  <Icon icon={componentTypeIconMap['slot']} class="w-3 h-3 opacity-50" />
                  <span class="flex-1 text-sm max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
                    {slot.name}
                  </span>
                </div>
                <ul
                  class="relative flex flex-col gap-0.5 pb-1"
                  // @ts-ignore - directive
                  use:droppable={{
                    enabled: isDropEnabled(),
                    id: slot.id,
                    path: [...component.path, 'slots', slot.id],
                    root: false,
                    x: leftPadding() + 32,
                    container: slotContainerRef
                  }}
                >
                  <For each={component.data.slots?.[slot.id] ?? []}>
                    {(child, index): JSX.Element => (
                      <RecursiveComponentItem
                        path={[...component.path, 'slots', slot.id, index()]}
                        data={child}
                        depth={component.depth + 2}
                        disableDrop={!isDropEnabled()}
                      />
                    )}
                  </For>
                </ul>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={component.data.children}>
        <ul ref={containerRef} class="relative flex flex-col gap-0.5 pb-1">
          <Show when={component.data.children!.length > 0}>
            <For each={component.data.children}>
              {(child, index): JSX.Element => (
                <RecursiveComponentItem
                  path={[...component.path, 'children', index()]}
                  data={child}
                  depth={component.depth + 1}
                  disableDrop={!isDropEnabled()}
                />
              )}
            </For>
          </Show>
        </ul>
      </Show>
    </li>
  )
}

const StructureList: Component = () => {
  let containerRef: HTMLUListElement | undefined
  const [dnd, , dropped] = useDnD()
  const basePath = createMemo(() => {
    return state?.current?.slice(0, 2) ?? ['pages', 0]
  })
  const children = createMemo(() => {
    return walker<ComponentData>(state.data, basePath())?.children ?? []
  })
  createEffect(() => {
    const event = dropped()
    if (!event) return
    const { droppable, data, index } = event
    if (droppable && data) {
      data.types.forEach((t) => {
        switch (t) {
          case 'kitae/move-component': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            const newPath = [...droppable.path]
            if (newPath[newPath.length - 2] === 'slots') {
              newPath.push(index)
            } else {
              newPath.push('children', index)
            }
            const isSamePath = samePath(draggable.path, newPath)
            if (draggable.id === droppable.id || isSamePath) break
            const sameContainer = samePath(draggable.path.slice(0, -2), droppable.path)
            const originalIndex = draggable.path[draggable.path.length - 1] as number
            const i = sameContainer && index > 0 && originalIndex < index ? index - 1 : index
            newPath[newPath.length - 1] = i
            makeMoveComponentChange({
              path: draggable.path,
              changes: [draggable.path, newPath]
            })
            break
          }
          case 'kitae/add-component': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            const path = [...droppable.path]
            if (path[path.length - 2] === 'slots') {
              path.push(index)
            } else {
              path.push('children', index)
            }
            makeAddComponentChange({
              path,
              changes: JSON.parse(JSON.stringify(draggable.data))
            })
            break
          }
          case 'Files':
            // TODO: Handle files (create a new Image component for each file, also what to do with the files? added to the project? I don't now yet)
            console.log(data.files)
            break
          case 'text/html':
            // TODO: Try to parse the html and create a new component for each element
            break
          case 'text/plain':
          case 'text/uri-list':
            // TODO: Handle text (could a text component, a link component, or a external kitae component)
            console.log(data.getData(t))
            break
        }
      })
    }
  })
  const displayDragPlaceholder = createMemo(() => {
    if (!dnd.draggable) return false
    if (!dnd.position) return false
    const rect = containerRef!.getBoundingClientRect()
    return (
      dnd.position.eventX >= rect.x &&
      dnd.position.eventX <= rect.x + rect.width &&
      dnd.position.y > 0
    )
  })
  return (
    <>
      <Show when={displayDragPlaceholder()}>
        <DragPlaceholder
          position={dnd.position!}
          offsetTop={containerRef?.getBoundingClientRect().top ?? 0}
        />
      </Show>
      <ul
        ref={containerRef}
        class="min-w-full relative w-max py-8 flex flex-col gap-0.5"
        // @ts-ignore - directive
        use:droppable={{ enabled: true, id: 'root', path: basePath(), x: 0 }}
      >
        <For each={children()}>
          {(component, i): JSX.Element => (
            <RecursiveComponentItem
              path={[...basePath(), 'children', i()]}
              data={component}
              depth={0}
            />
          )}
        </For>
      </ul>
    </>
  )
}

interface StructureManagerProps {
  scrollTop: number
}

const StructureManager: Component<StructureManagerProps> = (props: StructureManagerProps) => {
  const [state] = useDesignerState()
  const currentStructureName = createMemo(() => {
    if (!state.current) return ''
    if (state.current[0] === 'pages') {
      return state.data?.pages.find((p) => p.id === state.page)?.name ?? ''
    }
    return state.data?.components.find((_, i) => i === state!.current[1])?.name ?? ''
  })
  const rounded = (): number => {
    return 8 - Math.max(0, Math.min(8, props.scrollTop * 0.1))
  }
  return (
    <section class="relative bg-base-200 rounded-lg min-h-screen">
      <header
        class="px-2 py-1 flex-1 flex gap-2 items-center sticky top-0 z-[201] bg-base-200 rounded-t-lg"
        style={{
          'border-top-left-radius': `${rounded()}px`,
          'border-top-right-radius': `${rounded()}px`
        }}
      >
        <Icon icon="structure" class="h-4 w-4 opacity-50" />
        <h1 class="flex-1">Structure</h1>
        <Badge class="max-w-24">{currentStructureName()}</Badge>
      </header>
      <OverlayScrollbarsComponent
        defer
        options={{
          overflow: { x: 'scroll', y: 'visible-hidden' },
          scrollbars: { autoHide: 'leave', autoHideDelay: 0 }
        }}
        class="h-[calc(100%-32px)]"
      >
        <StructureList />
      </OverlayScrollbarsComponent>
    </section>
  )
}

export default StructureManager
