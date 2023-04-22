import Icon from '@renderer/components/Icon'
import RadioButton from '@renderer/components/form/RadioButton'
import RadioGroup from '@renderer/components/form/RadioGroup'
import { Component, For, JSX } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { useConfigForm } from './helpers/config.util'
import { PropertyProps } from './types'

interface ComponentFlexPropertyProps extends PropertyProps {
  labelClass?: string
}

type FlexDataFunc = (cdir?: string) => { [k: string]: boolean | undefined }

interface FlexItemData {
  label: string
  value: string
  icon: string
  classList?: FlexDataFunc
}

const quickFlexCombination: FlexItemData[] = [
  { label: 'Expand', value: 'expand', icon: 'flex-expand' },
  {
    label: 'Auto',
    value: 'auto',
    icon: 'flex-auto'
  },
  { label: 'initial', value: 'initial', icon: 'flex-initial' }
]

const ComponentFlexItemProperty: Component<ComponentFlexPropertyProps> = (
  props: ComponentFlexPropertyProps
) => {
  const form = useConfigForm(
    {
      quick: { value: '' }
    },
    props
  )
  return (
    <ComponentProperty label="Flex layout" index={props.index} path={props.path}>
      <div class="px-4 pb-2 flex flex-col gap-1">
        <section class="flex gap-4 items-center">
          <h1 class="basis-16 opacity-70">Flex</h1>
          <RadioGroup label="Flex group" class="w-full grid-cols-3">
            <For each={quickFlexCombination}>
              {(item): JSX.Element => (
                <RadioButton control={form.controls.quick} label={item.label} value={item.value}>
                  <Icon
                    icon={item.icon}
                    class="w-4 h-4"
                    classList={item.classList ? item.classList() : {}}
                  />
                </RadioButton>
              )}
            </For>
          </RadioGroup>
        </section>
      </div>
    </ComponentProperty>
  )
}

export default ComponentFlexItemProperty
