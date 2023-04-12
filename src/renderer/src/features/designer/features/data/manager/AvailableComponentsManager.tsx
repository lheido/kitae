import { ComponentData } from '@kitae/shared/types'
import { getSlots } from '@kitae/shared/utils'
import Accordion from '@renderer/components/Accordion'
import Icon from '@renderer/components/Icon'
import { defaultComponents } from '@renderer/features/designer/default-components'
import { componentTypeIconMap } from '@renderer/features/designer/icon-map'
import { Draggable, draggable, droppable } from '@renderer/features/drag-n-drop'
import { Component, For, JSX, Show, createMemo } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { useDesignerState } from '../../state/designer.state'
import { ManagerProps } from './types'

!!droppable && false
!!draggable && false

const AvailableComponentsManager: Component<ManagerProps> = (props: ManagerProps) => {
  const [state, { navigate }] = useDesignerState()
  const makeComponent = (component: Partial<ComponentData>): Draggable => {
    const id = crypto.randomUUID()
    const data = JSON.parse(JSON.stringify(component))
    data.id = id
    if (data.type === 'custom') {
      data.ref = component.id
      data.children = []
      data.slots = {}
      const slots = getSlots(component as ComponentData)
      for (const slot of slots) {
        data.slots[slot.id] = []
      }
    }

    return JSON.parse(
      JSON.stringify({
        format: 'kitae/add-component',
        effect: 'copy',
        id,
        path: [],
        data,
        enabled: true
      })
    )
  }
  const isPage = createMemo((): boolean => state.current[0] === 'pages')
  return (
    <Accordion
      accordionId="workspace-views-components"
      opened={true}
      label="Components"
      icon="components"
      maxHeight={props.maxHeight ?? 200}
      minHeight={82}
      class="bg-base-300 rounded-lg sticky bottom-2 z-[201]"
    >
      <ul>
        <li>
          <p class="italic">Native</p>
          <ul class="grid grid-cols-2">
            <For each={defaultComponents}>
              {(component): JSX.Element => (
                <li>
                  <button
                    class={twMerge(
                      'cursor-grab',
                      'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
                      'border border-transparent',
                      'disabled:opacity-25 disabled:cursor-not-allowed',
                      'hover:bg-secondary-focus hover:bg-opacity-30',
                      'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30'
                    )}
                    disabled={['slot', 'children'].includes(component.type!) && isPage()}
                    // @ts-ignore - directive
                    // eslint-disable-next-line solid/jsx-no-undef
                    use:draggable={(): Draggable => makeComponent(component)}
                  >
                    <Icon
                      icon={componentTypeIconMap[component.type as string]}
                      class="w-3 h-3 opacity-50"
                    />
                    <span class="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
                      {component.name}
                    </span>
                  </button>
                </li>
              )}
            </For>
          </ul>
        </li>
        <Show when={state.data && state.data.components.length > 0}>
          <li>
            <p class="italic">Yours</p>
            <ul class="grid grid-cols-2">
              <For each={state.data!.components}>
                {(component, index): JSX.Element => (
                  <li>
                    <button
                      class={twMerge(
                        'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
                        'border border-transparent',
                        'hover:bg-secondary-focus hover:bg-opacity-30',
                        'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30'
                      )}
                      onClick={(): void => {
                        navigate(['components', index()])
                      }}
                      // @ts-ignore - directive
                      // eslint-disable-next-line solid/jsx-no-undef
                      use:draggable={(): Draggable => makeComponent(component)}
                    >
                      <Icon
                        icon={componentTypeIconMap[component.type as string]}
                        class="w-3 h-3 opacity-50"
                      />
                      <span class="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
                        {component.name}
                      </span>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </li>
        </Show>
      </ul>
    </Accordion>
  )
}

export default AvailableComponentsManager
