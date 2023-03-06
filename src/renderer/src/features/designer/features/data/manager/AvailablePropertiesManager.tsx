/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Icon from '@renderer/components/Icon'
import { defaultProperties } from '@renderer/features/designer/default-properties'
import { propertyTypeIconMap } from '@renderer/features/designer/icon-map'
import { Draggable, draggable, droppable } from '@renderer/features/drag-n-drop'
import { Component, createMemo, For, JSX } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { useDesignerState } from '../../state/designer.state'
import { walker } from '../../utils/walker.util'
import { ManagerProps } from './types'

!!droppable && false
!!draggable && false

export interface AvailableComponentsManagerProps extends ManagerProps {
  types: string[]
}

const AvailableComponentsManager: Component<AvailableComponentsManagerProps> = (
  props: AvailableComponentsManagerProps
) => {
  const [state] = useDesignerState()
  const path = createMemo(() => [...state.current, 'config'])
  const config = createMemo(() => (walker(state.data, path()) as ComponentConfig[]) || [])
  const makeProp = (property: any): Draggable => {
    return JSON.parse(
      JSON.stringify({
        format: 'kitae/add-config',
        effect: 'copy',
        id: property.type,
        path: [...state.current, 'config'],
        data: property,
        enabled: !config().find((c) => c.type === property.type)
      })
    )
  }
  return (
    <Accordion
      accordionId="workspace-views-properties"
      opened={true}
      label="Props"
      icon="components"
      maxHeight={props.maxHeight ?? 320}
      minHeight={82}
      class="bg-base-300 rounded-lg sticky bottom-0 z-[201]"
    >
      <ul class="grid grid-cols-2">
        <For each={defaultProperties}>
          {(property): JSX.Element => (
            <li>
              <button
                class={twMerge(
                  'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
                  'border border-transparent',
                  'hover:bg-secondary-focus hover:bg-opacity-30',
                  'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                disabled={!!config().find((c) => c.type === property.type)}
                // @ts-ignore - directive
                // eslint-disable-next-line solid/jsx-no-undef
                use:draggable={(): Draggable => makeProp(property)}
              >
                <Icon
                  icon={propertyTypeIconMap[property.type as string]}
                  class="w-3 h-3 opacity-50"
                />
                <span class="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
                  {property.type}
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
