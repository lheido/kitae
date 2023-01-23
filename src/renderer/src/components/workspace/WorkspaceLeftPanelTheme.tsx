import { defaultWorkspaceData } from '@kitae/shared/default/workspace'
import { ThemeData } from '@kitae/shared/types'
import { Component, For, JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import Accordion from '../Accordion'
import Button from '../Button'

const themes = defaultWorkspaceData.themes

interface ThemeState {
  current: string
  readonly theme: ThemeData
}

const WorkspaceLeftPanelTheme: Component = () => {
  const [state, setState] = createStore<ThemeState>({
    current: 'default',
    get theme(): ThemeData {
      return themes.find((t) => t.name === this.current) as ThemeData
    }
  })
  return (
    <>
      <h1 class="sr-only">Workspace Theme</h1>
      <Accordion
        accordionId="workspace-themes"
        opened={false}
        label="Themes"
        basis="50%"
        class="bg-base-200 rounded-lg"
        headerSlot={
          <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
            <p class="text-xs px-2 py-0.5 rounded bg-primary bg-opacity-20 select-none">
              {state.theme.name}
            </p>
          </div>
        }
      >
        <ul class="flex flex-col">
          <For each={themes}>
            {(theme): JSX.Element => (
              <li>
                <Button
                  class="btn-list-item"
                  classList={{ active: state.current === theme.name }}
                  onClick={(): void => setState('current', theme.name)}
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
        <ul class="flex flex-col gap-4">
          <For each={state.theme.colors}>
            {(color): JSX.Element => (
              <li class="flex items-center gap-2">
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
              </li>
            )}
          </For>
        </ul>
      </Accordion>
      <Accordion
        accordionId="workspace-font"
        opened={true}
        label="Fonts"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        <ul class="flex flex-col gap-2">
          <For each={state.theme.fonts.family}>
            {(font): JSX.Element => (
              <li class="flex items-center gap-4">
                <span
                  class="flex-1 text-2xl text-ellipsis whitespace-nowrap overflow-hidden"
                  style={{ 'font-family': font.value }}
                >
                  {font.name}
                </span>
              </li>
            )}
          </For>
        </ul>
      </Accordion>
    </>
  )
}

export default WorkspaceLeftPanelTheme
