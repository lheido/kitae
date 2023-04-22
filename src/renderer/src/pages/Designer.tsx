import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import PanelSeparator from '@renderer/components/PanelSeparator'
import Toast from '@renderer/components/Toast'
import { useDesignerState } from '@renderer/features/designer'
import Preview from '@renderer/features/designer/components/Preview'
import { routes } from '@renderer/features/designer/routing'
import { redoShortcut, undoShortcut } from '@renderer/features/history'
import { Shortcut, registerGlobalShortcut } from '@renderer/features/keyboard'
import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js'
import { Dynamic } from 'solid-js/web'

interface Panel {
  ids: string[]
  icon: string
  label: string
  rightPanel: boolean
  shortcut: Shortcut
}

const Designer: Component = () => {
  const [state, { navigate }] = useDesignerState()
  // TODO: use useCmdUI to modify the UI according to the user preferences
  // console.log(userSettings.useCmdUI)

  const shortcutGoToSettings = new Shortcut(['Alt', 's'], (): void => navigate(['settings']))
  const shortcutGoToTheme = new Shortcut(['Alt', 't'], (): void => navigate(['theme']))
  const shortcutGoToPages = new Shortcut(['Alt', 'v'], (): void => navigate(['pages']))
  registerGlobalShortcut(
    shortcutGoToSettings,
    shortcutGoToTheme,
    shortcutGoToPages,
    undoShortcut,
    redoShortcut
  )

  const panels: Panel[] = [
    {
      ids: ['settings'],
      icon: 'settings',
      label: 'Settings',
      rightPanel: false,
      shortcut: shortcutGoToSettings
    },
    {
      ids: ['pages', 'components'],
      icon: 'designer-tree',
      label: 'Views',
      rightPanel: true,
      shortcut: shortcutGoToPages
    },
    {
      ids: ['theme'],
      icon: 'palette',
      label: 'Theme',
      rightPanel: true,
      shortcut: shortcutGoToTheme
    }
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

  const [timeBeforeDisplayLoading, setTimeBeforeDisplayLoading] = createSignal(false)
  setTimeout(() => setTimeBeforeDisplayLoading(!state.data), 100)
  const workspaceLoading = createMemo(() => timeBeforeDisplayLoading() && !state.data)
  return (
    <section class="flex-1 h-full flex designer-page relative overflow-x-hidden">
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
                  title={`${panel.label} - ${panel.shortcut.toString()}`}
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
        class="absolute z-50"
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
      <Show when={workspaceLoading()}>
        <div class="absolute top-0 left-0 bottom-0 right-0 bg-base-300 bg-opacity-80 flex justify-center items-center">
          <Toast type="info">Retrieving workspace data...</Toast>
        </div>
      </Show>
    </section>
  )
}

export default Designer
