import { ComponentData, Path } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import {
  Draggable,
  draggable,
  DragPlaceholder,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { useHistory } from '@renderer/features/history'
import {
  Component,
  ComponentProps,
  createEffect,
  createMemo,
  For,
  JSX,
  onMount,
  Show,
  splitProps
} from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { defaultComponents } from '../../default-components'
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers } from '../../types'
import { samePath, walker } from '../../utils'

!!droppable && false
!!draggable && false

interface PageItemProps extends ComponentProps<'button'> {
  page: Pick<ComponentData, 'id' | 'name'>
  active: boolean
}

const PageItem: Component<PageItemProps> = (props: PageItemProps) => {
  const [component, button] = splitProps(props, ['page', 'active'])
  const [state, { navigate, setPage }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const deletePage = (): void => {
    const p: Path = JSON.parse(
      JSON.stringify(['pages', state.data!.pages.findIndex((t) => t.id === component.page.id)])
    )
    const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
    const isActive = JSON.parse(JSON.stringify(component.active))
    const newIndex = Math.max(Math.min((p[1] as number) - 1, state.data!.pages.length - 1), 0)
    makeChange({
      path: p,
      changes: previous,
      handler: DesignerHistoryHandlers.DELETE_PAGE_DATA,
      additionalHandler: {
        execute: (): void => {
          if (isActive) {
            navigate(['pages', newIndex])
            setPage(state.data!.pages[newIndex].id)
          }
        },
        undo: (): void => {
          if (isActive) {
            navigate(['pages', p[1]])
            setPage(state.data!.pages[p[1] as number].id)
          }
        }
      }
    })
  }
  return (
    <li class="relative">
      <Button class="btn-list-item" classList={{ active: component.active }} {...button}>
        {component.page.name}
      </Button>
      <Show when={state.data!.pages.length > 1}>
        <Button
          class="btn-error btn-icon !p-2 absolute top-1/2 right-1 -translate-y-1/2"
          // TODO: Why eslint solid/reactivity warning here ? It doesn't throw a warning in the ThemeEntryItem component...
          // eslint-disable-next-line solid/reactivity
          onClick={(): void => {
            deletePage()
          }}
        >
          <Icon icon="bin" class="w-4 h-4" />
        </Button>
      </Show>
    </li>
  )
}

const componentTypeIconMap: Record<string, string> = {
  container: 'box',
  text: 'font-family',
  button: 'tap'
}

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
      data-dnd-index={component.path[component.path.length - 1]}
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
          'border border-transparent',
          'hover:bg-secondary-focus hover:bg-opacity-30',
          'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30',
          classes.class
        )}
        classList={{
          '!border-secondary': isActive()
        }}
        style={{ 'padding-left': `${leftPadding()}px` }}
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
      <ul ref={containerRef} class="relative flex flex-col gap-0.5 pb-0.5">
        <Show when={component.data.children && component.data.children.length > 0}>
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
            makeChange({
              handler: DesignerHistoryHandlers.MOVE_COMPONENT_DATA,
              path: draggable.path,
              changes: [draggable.path, [...droppable.path, 'children', index]]
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
  return (
    <>
      <ul
        ref={containerRef}
        class="min-w-full relative w-max py-8 flex flex-col gap-0.5"
        // @ts-ignore - directive
        use:droppable={{ enabled: true, id: 'root', path: ['pages', pageIndex()], x: 0 }}
      >
        <Show when={!!dnd.droppable && dnd.position && dnd.position.y > 0}>
          <DragPlaceholder
            position={dnd.position!}
            offsetTop={containerRef?.getBoundingClientRect().top ?? 0}
          />
        </Show>
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

const ViewsLeftPanelContent: Component = () => {
  const [state, { setPage, navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()

  const pageName = createMemo(() => {
    return state.data?.pages.find((p) => p.id === state.page)?.name ?? ''
  })
  const pageId = createMemo(() => {
    return state.data?.pages.find((p) => p.id === state.page)?.id ?? ''
  })

  onMount(() => {
    if (state.page === undefined && state.data && state.data.pages.length > 0) {
      setPage(state.data?.pages[0].id)
    }
  })

  const makeComponent = (component: Partial<ComponentData>): Draggable => {
    const id = crypto.randomUUID()
    return JSON.parse(
      JSON.stringify({
        format: 'kitae/add-component',
        effect: 'copy',
        id,
        path: [],
        data: { ...component, id }
      })
    )
  }

  return (
    <>
      <Accordion
        accordionId="workspace-views-page"
        opened={false}
        label="Pages"
        icon="pages"
        basis="40%"
        class="bg-base-200 rounded-lg"
        headerSlot={
          <Show when={state.page}>
            <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
              <p class="text-xs px-2 py-0.5 rounded bg-primary bg-opacity-20 select-none">
                {pageName()}
              </p>
            </div>
          </Show>
        }
      >
        <ul class="flex flex-col">
          <For each={state.data!.pages}>
            {(page): JSX.Element => (
              <PageItem
                page={{ id: page.id, name: page.name }}
                active={page.id === pageId()}
                onClick={(): void => {
                  navigate(['pages', state.data!.pages.findIndex((t) => t.id === page.id)])
                  setPage(page.id)
                }}
              />
            )}
          </For>
          <li>
            <Button
              class="btn-list-item items-center pl-4 border border-base-200"
              onClick={(): void => {
                const changes: ComponentData = {
                  id: crypto.randomUUID(),
                  name: `New page`,
                  type: 'container',
                  children: []
                }
                makeChange({
                  path: ['pages'],
                  changes,
                  handler: DesignerHistoryHandlers.ADD_PAGE_DATA,
                  additionalHandler: {
                    execute: (): void => {
                      navigate(['pages', state.data!.pages.length - 1])
                      setPage(changes.id)
                    },
                    undo: (): void => {
                      navigate(['pages', state.data!.pages.length - 1])
                      setPage(state.data!.pages[state.data!.pages.length - 1]?.id)
                    }
                  }
                })
              }}
            >
              <Icon icon="add" />
              <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">
                Add a new page
              </span>
            </Button>
          </li>
        </ul>
      </Accordion>
      <Accordion
        accordionId="workspace-views-structure"
        opened={true}
        label="Structure"
        icon="structure"
        basis="100%"
        class="bg-base-200 rounded-lg"
        contentClass="p-0"
      >
        <StructureList />
      </Accordion>
      <Accordion
        accordionId="workspace-views-components"
        opened={true}
        label="Components"
        icon="components"
        basis="40%"
        class="bg-base-200 rounded-lg"
      >
        <ul>
          <For each={defaultComponents}>
            {(component): JSX.Element => (
              <li>
                <button
                  class={twMerge(
                    'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
                    'border border-transparent',
                    'hover:bg-secondary-focus hover:bg-opacity-30',
                    'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30'
                  )}
                  // @ts-ignore - directive
                  // eslint-disable-next-line solid/jsx-no-undef
                  use:draggable={(): Draggable => makeComponent(component)}
                >
                  <Icon
                    icon={componentTypeIconMap[component.type as string]}
                    class="w-3 h-3 opacity-50"
                  />
                  {component.name}
                </button>
              </li>
            )}
          </For>
        </ul>
      </Accordion>
    </>
  )
}

const ViewsLeftPanel: Component = () => {
  return (
    <>
      <h1 class="sr-only">Workspace Views - left panel</h1>
      <ViewsLeftPanelContent />
    </>
  )
}

export default ViewsLeftPanel
