import { ThemeData, ThemeEntry } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { WorkspaceDataContext } from '@renderer/features/designer/contexts/WorkspaceDataProvider'
import { Component, ComponentProps, For, JSX, Show, useContext } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { Path } from '../../types'
import { walker } from '../../utils'

interface ThemeEntryItemProps extends ComponentProps<'li'> {
  children: JSX.Element
  theme: number
  path: Path
}

const ThemeEntryItem: Component<ThemeEntryItemProps> = (props: ThemeEntryItemProps) => {
  const [workspaceDataStore, , { get, select, samePath, createUpdate, setState }] =
    useContext(WorkspaceDataContext)
  const path = (): Path => ['themes', props.theme, ...props.path]
  const deleteItem = (): void => {
    const p = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(JSON.stringify(get(p)))
    createUpdate({
      execute: (): void => {
        setState(
          produce((s) => {
            const list = walker(s.data, p.slice(0, -1)) as ThemeEntry[]
            if (list) {
              list.splice(p[p.length - 1], 1)
              s.selectedPath = []
            } else {
              console.error('Try to execute delete :', path)
            }
          })
        )
      },
      undo: (): void => {
        setState(
          produce((s) => {
            const list = walker(s.data, p.slice(0, -1)) as ThemeEntry[]
            if (list) {
              list.splice(p[p.length - 1], 0, previous)
            } else {
              console.error('Try to undo delete :', p)
            }
          })
        )
      }
    })
  }
  return (
    <li class="relative">
      <Button
        class="btn-list-item items-center border border-base-200"
        classList={{ 'border-active': samePath(path(), workspaceDataStore.selectedPath) }}
        onClick={(): void => {
          select(path())
        }}
      >
        {props.children}
      </Button>
      <Button
        class="btn-error btn-icon !p-2 absolute top-1/2 right-1 -translate-y-1/2"
        onClick={(): void => deleteItem()}
      >
        <Icon icon="bin" class="w-4 h-4" />
      </Button>
    </li>
  )
}

interface AddThemeEntryItemProps extends ComponentProps<'li'> {
  theme: number
}

const AddColorThemeEntryItem: Component<AddThemeEntryItemProps> = (
  props: AddThemeEntryItemProps
) => {
  const [, , { createUpdate, setState }] = useContext(WorkspaceDataContext)
  const path = (): Path => ['themes', props.theme, 'colors']
  return (
    <li>
      <Button
        class="btn-list-item items-center pl-4 border border-base-200"
        onClick={(): void => {
          createUpdate({
            execute: (): void => {
              setState(
                produce((s) => {
                  const list = walker<ThemeEntry[]>(s.data, path())
                  list!.push({
                    name: 'new-color',
                    value: '#828282'
                  })
                  s.selectedPath = [...path(), list!.length - 1]
                })
              )
            },
            undo: (): void => {
              setState(
                produce((s) => {
                  walker<ThemeEntry[]>(s.data, path())!.pop()
                  s.selectedPath = []
                })
              )
            }
          })
        }}
      >
        <Icon icon="add" />
        <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">Add a new color</span>
      </Button>
    </li>
  )
}

interface ThemeState {
  current: string
  readonly theme: ThemeData
  readonly themeIndex: number
}

const WorkspaceLeftPanelTheme: Component = () => {
  const [workspaceDataStore, , { select, createUpdate }] = useContext(WorkspaceDataContext)
  const [state, setState] = createStore<ThemeState>({
    current: 'default',
    get theme(): ThemeData {
      return workspaceDataStore.data?.themes.find((t) => t.name === this.current) as ThemeData
    },
    get themeIndex(): number {
      return workspaceDataStore.data?.themes.findIndex((t) => t.name === this.current) as number
    }
  })
  return (
    <>
      <h1 class="sr-only">Workspace Theme - left panel</h1>
      <Accordion
        accordionId="workspace-themes"
        opened={false}
        label="Themes"
        basis="50%"
        class="bg-base-200 rounded-lg"
        headerSlot={
          <Show when={state.theme?.name}>
            <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
              <p class="text-xs px-2 py-0.5 rounded bg-primary bg-opacity-20 select-none">
                {state.theme.name}
              </p>
            </div>
          </Show>
        }
      >
        <ul class="flex flex-col">
          <For each={workspaceDataStore.data?.themes}>
            {(theme): JSX.Element => (
              <li>
                <Button
                  class="btn-list-item"
                  classList={{ active: state.current === theme.name }}
                  onClick={(): void => {
                    setState('current', theme.name)
                    select([])
                  }}
                >
                  {theme.name}
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Accordion>
      <Accordion
        accordionId="workspace-colors"
        opened={true}
        label="Colors"
        basis="200%"
        class="bg-base-200 rounded-lg max-w-xs"
      >
        <Show when={state.theme} fallback={<p>No theme selected</p>}>
          <ul class="flex flex-col gap-0">
            <For each={state.theme.colors}>
              {(color, i): JSX.Element => (
                <ThemeEntryItem theme={state.themeIndex} path={['colors', i()]}>
                  <span
                    class="w-8 h-8 rounded-full border border-base-300"
                    style={{ 'background-color': color.value }}
                  />
                  <span
                    class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden"
                    title={color.name}
                  >
                    {color.name}
                  </span>
                </ThemeEntryItem>
              )}
            </For>
            <AddColorThemeEntryItem theme={state.themeIndex} />
          </ul>
        </Show>
      </Accordion>
      <Accordion
        accordionId="workspace-font"
        opened={true}
        label="Fonts"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        <Show when={state.theme} fallback={<p>No theme selected</p>}>
          <ul class="flex flex-col gap-2">
            <For each={state.theme.fonts.family}>
              {(family, i): JSX.Element => (
                <ThemeEntryItem theme={state.themeIndex} path={['fonts', 'family', i()]}>
                  <span
                    class="flex-1 text-2xl leading-none text-ellipsis whitespace-nowrap overflow-hidden"
                    style={{ 'font-family': family.value }}
                  >
                    {family.name}
                  </span>
                </ThemeEntryItem>
              )}
            </For>
          </ul>
        </Show>
      </Accordion>
    </>
  )
}

export default WorkspaceLeftPanelTheme
