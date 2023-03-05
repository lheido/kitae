import { ComponentData, Path } from '@kitae/shared/types'
import Badge from '@renderer/components/Badge'
import Icon from '@renderer/components/Icon'
import { componentTypeIconMap } from '@renderer/features/designer/icon-map'
import {
  draggable,
  Draggable,
  DragPlaceholder,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { useHistory } from '@renderer/features/history'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import {
  Component,
  ComponentProps,
  createEffect,
  createMemo,
  For,
  JSX,
  Show,
  splitProps
} from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { useDesignerState } from '../../state/designer.state'
import { samePath } from '../../utils/same-path.util'
import { DesignerHistoryHandlers } from '../../utils/types'

!!droppable && false
!!draggable && false

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
  const [component, classes, button] = splitProps(
    props,
    ['path', 'data', 'depth', 'disableDrop'],
    ['class']
  )
  const [state, { navigate }] = useDesignerState()
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
  // const [, { makeChange }] = useHistory()
  // const deleteComponent = (): void => {
  //   const p: Path = JSON.parse(JSON.stringify(component.path))
  //   const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
  //   makeChange({
  //     path: p,
  //     changes: previous,
  //     handler: DesignerHistoryHandlers.DELETE_COMPONENT_DATA
  //   })
  // }
  const clickHandler = (): void => {
    navigate(component.path)
  }
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
          path: component.path
        }}
      >
        <Icon icon={componentTypeIconMap[component.data.type]} class="w-3 h-3 opacity-50" />
        <span class="flex-1 max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
          {component.data.name}
        </span>
      </button>
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
          {/* <li>
            <button
              class={twMerge(
                'flex px-2 gap-2 py-1 w-full rounded items-center text-left whitespace-nowrap',
                'border border-transparent',
                'hover:bg-secondary-focus hover:bg-opacity-30',
                'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30'
              )}
              style={{ 'padding-left': `${leftPadding()}px` }}
            >
              <Icon icon="add" class="w-3 h-3 opacity-50" />
              Add item
            </button>
          </li> */}
        </ul>
      </Show>
    </li>
  )
}

const StructureList: Component = () => {
  let containerRef: HTMLUListElement | undefined
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const [dnd, , dropped] = useDnD()
  const pageIndex = createMemo(() => {
    return state.data?.pages.findIndex((p) => p.id === state.page) ?? 0
  })
  const pageChildren = (): ComponentData[] => {
    return state.data?.pages.find((p) => p.id === state.page)?.children ?? []
  }
  createEffect(() => {
    const event = dropped()
    if (!event) return
    const { droppable, data, index } = event
    if (droppable && data) {
      data.types.forEach((t) => {
        switch (t) {
          case 'kitae/move-component': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            const isSamePath = samePath(draggable.path, [...droppable.path, 'children', index])
            if (draggable.id === droppable.id || isSamePath) break
            const sameContainer = samePath(draggable.path.slice(0, -2), droppable.path)
            const originalIndex = draggable.path[draggable.path.length - 1]
            const i = sameContainer && index > 0 && originalIndex < index ? index - 1 : index
            makeChange({
              handler: DesignerHistoryHandlers.MOVE_COMPONENT_DATA,
              path: draggable.path,
              changes: [draggable.path, [...droppable.path, 'children', i]]
            })
            break
          }
          case 'kitae/add-component': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            makeChange({
              handler: DesignerHistoryHandlers.ADD_COMPONENT_DATA,
              path: [...droppable.path, 'children', index],
              changes: JSON.parse(JSON.stringify(draggable.data))
            })
            break
          }
          case 'Files':
            // @TODO: Handle files (create a new Image component for each file, also what to do with the files? added to the project? I don't now yet)
            console.log(data.files)
            break
          case 'text/html':
            // @TODO: Try to parse the html and create a new component for each element
            break
          case 'text/plain':
          case 'text/uri-list':
            // @TODO: Handle text (could a text component, a link component, or a external kitae component)
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
        use:droppable={{ enabled: true, id: 'root', path: ['pages', pageIndex()], x: 0 }}
      >
        <For each={pageChildren()}>
          {(component, i): JSX.Element => (
            <RecursiveComponentItem
              path={['pages', pageIndex(), 'children', i()]}
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
  const pageName = createMemo(() => {
    return state.data?.pages.find((p) => p.id === state.page)?.name ?? ''
  })
  const rounded = (): number => {
    return 8 - Math.max(0, Math.min(8, props.scrollTop * 0.1))
  }
  const badgeOpacity = (): number => {
    return Math.max(0, Math.min(1, (props.scrollTop - 130) * 0.02))
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
        <Badge style={{ opacity: badgeOpacity() }}>{pageName()}</Badge>
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
