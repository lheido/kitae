import Accordion from '@renderer/components/Accordion'
import Badge from '@renderer/components/Badge'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
import { ComponentData, Path } from 'packages/shared/types'
import {
  Component,
  ComponentProps,
  createMemo,
  For,
  JSX,
  onMount,
  Show,
  splitProps
} from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import { ManagerProps } from './types'

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

const PagesManager: Component<ManagerProps> = (props: ManagerProps) => {
  const [state, { navigate, setPage }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const pageName = createMemo(() => {
    return state.data?.pages.find((p) => p.id === state.page)?.name ?? ''
  })
  const pageId = createMemo(() => {
    return state.data?.pages.find((p) => p.id === state.page)?.id ?? ''
  })

  onMount(() => {
    if (state.current.length === 1) {
      navigate(['pages', 0])
    }
    if (state.page === undefined && state.data && state.data.pages.length > 0) {
      setPage(state.data?.pages[state.current[1]].id)
    }
  })
  return (
    <Accordion
      accordionId="workspace-views-page"
      opened={props.opened ?? false}
      label="Pages"
      icon="pages"
      maxHeight={props.maxHeight ?? 320}
      minHeight={82}
      class="bg-base-200 rounded-lg"
      headerSlot={
        <Show when={state.page}>
          <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
            <Badge>{pageName()}</Badge>
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
  )
}

export default PagesManager
