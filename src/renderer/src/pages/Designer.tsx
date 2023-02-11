import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import PanelSeparator from '@renderer/components/PanelSeparator'
import { useDesignerState } from '@renderer/features/designer'
import Preview from '@renderer/features/designer/components/Preview'
import { routes } from '@renderer/features/designer/routing'
import { Component, createMemo, For, JSX, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

const Designer: Component = () => {
  const [state, { navigate }] = useDesignerState()
  const panels: { ids: string[]; icon: string; label: string; rightPanel: boolean }[] = [
    { ids: ['settings'], icon: 'settings', label: 'Settings', rightPanel: false },
    { ids: ['pages', 'components'], icon: 'designer-tree', label: 'Views', rightPanel: true },
    { ids: ['theme'], icon: 'palette', label: 'Theme', rightPanel: true }
  ]
  const getLeftPanel = createMemo(() => {
    const components = routes
      .filter((r) => r.path.every((e, i) => (e !== '$' ? state.current[i] === e : true)))
      .filter((r) => !!r.left)
      .map((r) => r.left)
    return components[components.length - 1]
  })
  const getRightPanel = createMemo(() => {
    const components = routes
      .filter((r) => r.path.every((e, i) => (e !== '$' ? state.current[i] === e : true)))
      .filter((r) => !!r.right)
      .map((r) => r.right)
    return components[components.length - 1]
  })
  return (
    <section class="flex-1 h-full flex designer-page relative">
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
      <section id="left-panel" class="bg-base-100 w-[320px] h-full">
        <Show when={state.data}>
          <Dynamic component={getLeftPanel()} />
        </Show>
      </section>
      <PanelSeparator
        class="absolute"
        target="left-panel"
        valuenow={320}
        valuemin={320}
        valuemax={720}
      />
      <section class="bg-base-100 flex-1 flex flex-col">
        <Preview />
      </section>
      <section
        class="bg-base-100 py-2 transition-all basis-0 overflow-hidden flex flex-col gap-2 h-full"
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
