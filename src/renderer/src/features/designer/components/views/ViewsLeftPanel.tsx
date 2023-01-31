import { ComponentData, Path } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
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
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers } from '../../types'
import { walker } from '../../utils'

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
      type: 'remove',
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

const ViewsLeftPanel: Component = () => {
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
  return (
    <>
      <h1 class="sr-only">Workspace Views - left panel</h1>
      <Accordion
        accordionId="workspace-views-page"
        opened={true}
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
                  type: 'add',
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
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolorem tenetur placeat,
        nesciunt nisi ipsam accusamus quas, tempora repudiandae, consectetur dolorum modi
        exercitationem pariatur voluptas animi deleniti earum numquam optio.
      </Accordion>
      <Accordion
        accordionId="workspace-views-components"
        opened={true}
        label="Components"
        icon="components"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolorem tenetur placeat,
        nesciunt nisi ipsam accusamus quas, tempora repudiandae, consectetur dolorum modi
        exercitationem pariatur voluptas animi deleniti earum numquam optio.
      </Accordion>
    </>
  )
}

export default ViewsLeftPanel
