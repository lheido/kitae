import { ThemeData } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Button from '@renderer/components/Button'
import { WorkspaceDataContext } from '@renderer/features/designer/contexts/WorkspaceDataProvider'
import { Component, ComponentProps, For, JSX, Show, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface ThemeEntryItemProps extends ComponentProps<'li'> {
  children: JSX.Element
  theme: number
  path: (string | number)[]
}

const ThemeEntryItem: Component<ThemeEntryItemProps> = (props: ThemeEntryItemProps) => {
  const [, , { select }] = useContext(WorkspaceDataContext)
  return (
    <li>
      <Button
        class="btn-list-item"
        classList={{ active: false }}
        onClick={(): void => {
          select(['themes', props.theme, ...props.path])
          // update(['themes', props.theme, ...props.path], (entry: ThemeEntry) => {
          //   entry.value = '#FF0000'
          // })
        }}
      >
        {props.children}
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
  const [workspaceDataStore, , { select }] = useContext(WorkspaceDataContext)
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
