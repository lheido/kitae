import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { designerState, setDesignerState, WorkspaceDataProvider } from '@renderer/features/designer'
import { Component, For, JSX, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

const Designer: Component = () => {
  const panels: { id: string; icon: string; label: string; rightPanel: boolean }[] = [
    { id: 'settings', icon: 'settings', label: 'Settings', rightPanel: false },
    { id: 'views', icon: 'designer-tree', label: 'Views', rightPanel: true },
    { id: 'theme', icon: 'palette', label: 'Theme', rightPanel: true }
  ]
  return (
    <WorkspaceDataProvider>
      <section class="flex-1 h-full flex designer-page">
        <h1 class="sr-only">Designer</h1>
        <section class="bg-base-300">
          <ul class="flex flex-col designer-nav bg-base-100">
            <For each={panels}>
              {(panel, index): JSX.Element => (
                <li
                  classList={{
                    active: designerState.current === panel.id,
                    'before-active':
                      panels.findIndex((p) => p.id === designerState.current) === index() + 1
                  }}
                >
                  <Button
                    class="btn-designer-nav"
                    classList={{ active: designerState.current === panel.id }}
                    onClick={(): void => setDesignerState('current', panel.id)}
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
          <Dynamic component={designerState.leftPanel} />
        </section>
        <section class="bg-base-100 flex-1 flex flex-col">
          <header class="py-2 px-3">Preview header</header>
          <div class="bg-base-300 flex-1 p-4 rounded-t-lg overflow-hidden">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut atque asperiores
            exercitationem incidunt repudiandae in vero accusamus, eligendi enim tempore, laboriosam
            quod! Molestiae ab eum quos deleniti modi adipisci accusantium.
          </div>
        </section>
        <section
          class="bg-base-100 p-2 transition-all basis-0 overflow-hidden flex flex-col gap-2 h-full"
          classList={{
            '!basis-80': panels.find((p) => p.id === designerState.current)?.rightPanel
          }}
        >
          <Show when={designerState.rightPanel}>
            <Dynamic component={designerState.rightPanel} />
          </Show>
        </section>
      </section>
    </WorkspaceDataProvider>
  )
}

export default Designer
