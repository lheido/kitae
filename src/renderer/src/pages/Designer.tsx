import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { WorkspaceDataContext } from '@renderer/features/designer'
import Preview from '@renderer/features/designer/components/Preview'
import { Component, For, JSX, Show, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'

const Designer: Component = () => {
  const [state, { navigate, getLeftPanel, getRightPanel }] = useContext(WorkspaceDataContext)
  const panels: { ids: string[]; icon: string; label: string; rightPanel: boolean }[] = [
    { ids: ['settings'], icon: 'settings', label: 'Settings', rightPanel: false },
    { ids: ['pages', 'components'], icon: 'designer-tree', label: 'Views', rightPanel: true },
    { ids: ['themes'], icon: 'palette', label: 'Theme', rightPanel: true }
  ]
  return (
    <section class="flex-1 h-full flex designer-page">
      <h1 class="sr-only">Designer</h1>
      <section class="bg-base-300">
        <ul class="flex flex-col designer-nav bg-base-100">
          <For each={panels}>
            {(panel, index): JSX.Element => (
              <li
                classList={{
                  active: panel.ids.includes(state.current[0] as string),
                  'before-active':
                    panels.findIndex((p) => p.ids.includes(state.current[0] as string)) ===
                    index() + 1
                }}
              >
                <Button
                  class="btn-designer-nav"
                  classList={{ active: panel.ids.includes(state.current[0] as string) }}
                  onClick={(): void => navigate([panel.ids[0]])}
                >
                  <Icon icon={panel.icon} />
                  <span class="text-xs">{panel.label}</span>
                </Button>
              </li>
            )}
          </For>
        </ul>
      </section>
      <section class="bg-base-100 p-2 basis-80 transition-all flex flex-col gap-2 h-full">
        <Show when={state.data}>
          <Dynamic component={getLeftPanel()} />
        </Show>
      </section>
      <section class="bg-base-100 flex-1 flex flex-col">
        <Preview />
      </section>
      <section
        class="bg-base-100 p-2 transition-all basis-0 overflow-hidden flex flex-col gap-2 h-full"
        classList={{
          '!basis-80': panels.find((p) => p.ids.includes(state.current[0] as string))?.rightPanel
        }}
      >
        <Show when={state.data}>
          <Dynamic component={getRightPanel()} />
        </Show>
      </section>
    </section>
  )
}

export default Designer
