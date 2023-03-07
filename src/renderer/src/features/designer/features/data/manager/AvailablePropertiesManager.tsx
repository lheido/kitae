/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Icon from '@renderer/components/Icon'
import {
  defaultProperties,
  defaultStateProperties
} from '@renderer/features/designer/default-properties'
import { propertyTypeIconMap } from '@renderer/features/designer/icon-map'
import { Draggable, draggable, droppable } from '@renderer/features/drag-n-drop'
import { Component, For, JSX } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import { useDesignerState } from '../../state/designer.state'
import { ManagerProps } from './types'

!!droppable && false
!!draggable && false

interface AvailablePropertyItemProps {
  property: Partial<ComponentConfig>
}

const AvailablePropertyItem: Component<AvailablePropertyItemProps> = (
  props: AvailablePropertyItemProps
) => {
  const [state] = useDesignerState()
  const makeProp = (property: Partial<ComponentConfig>): Draggable => {
    return JSON.parse(
      JSON.stringify({
        format: 'kitae/add-config',
        effect: 'copy',
        id: crypto.randomUUID(),
        path: [...state.current, 'config'],
        data: property,
        enabled: true
      })
    )
  }
  return (
    <li>
      <button
        class={twMerge(
          'flex px-2 gap-2 py-1 w-full rounded items-center whitespace-nowrap',
          'border border-transparent',
          'hover:bg-secondary-focus hover:bg-opacity-30',
          'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        // @ts-ignore - directive
        // eslint-disable-next-line solid/jsx-no-undef
        use:draggable={(): Draggable => makeProp(props.property)}
      >
        <Icon
          icon={propertyTypeIconMap[props.property.type as string]}
          class="w-3 h-3 opacity-50"
        />
        <span class="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden capitalize">
          {props.property.type}
        </span>
      </button>
    </li>
  )
}

export interface AvailableComponentsManagerProps extends ManagerProps {
  types: string[]
}

const AvailableComponentsManager: Component<AvailableComponentsManagerProps> = (
  props: AvailableComponentsManagerProps
) => {
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
      <ul>
        <li>
          <p class="italic">Basic</p>
          <ul class="grid grid-cols-2">
            <For each={defaultProperties}>
              {(property): JSX.Element => <AvailablePropertyItem property={property} />}
            </For>
          </ul>
        </li>
        <li>
          <p class="italic">Element state</p>
          <ul class="grid grid-cols-2">
            <For each={defaultStateProperties}>
              {(property): JSX.Element => <AvailablePropertyItem property={property} />}
            </For>
          </ul>
        </li>
      </ul>
    </Accordion>
  )
}

export default AvailableComponentsManager
