import { ComponentData } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Icon from '@renderer/components/Icon'
import { defaultComponents } from '@renderer/features/designer/default-components'
import { componentTypeIconMap } from '@renderer/features/designer/icon-map'
import { Draggable, draggable, droppable } from '@renderer/features/drag-n-drop'
import { Component, For, JSX } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { ManagerProps } from './types'

!!droppable && false
!!draggable && false

const AvailableComponentsManager: Component<ManagerProps> = (props: ManagerProps) => {
  const makeComponent = (component: Partial<ComponentData>): Draggable => {
    const id = crypto.randomUUID()
    return JSON.parse(
      JSON.stringify({
        format: 'kitae/add-component',
        effect: 'copy',
        id,
        path: [],
        data: { ...component, id },
        enabled: true
      })
    )
  }
  return (
    <Accordion
      accordionId="workspace-views-components"
      opened={true}
      label="Components"
      icon="components"
      maxHeight={props.maxHeight ?? 320}
      minHeight={82}
      class="bg-base-300 rounded-lg sticky bottom-2 z-[201]"
    >
      <ul class="grid grid-cols-2">
        <For each={defaultComponents}>
          {(component): JSX.Element => (
            <li>
              <button
                class={twMerge(
                  'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
                  'border border-transparent',
                  'hover:bg-secondary-focus hover:bg-opacity-30',
                  'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30'
                )}
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
    </Accordion>
  )
}

export default AvailableComponentsManager
