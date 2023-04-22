import Icon from '@renderer/components/Icon'
import RadioButton from '@renderer/components/form/RadioButton'
import RadioGroup from '@renderer/components/form/RadioGroup'
import { Component, For, JSX, createMemo } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { useConfigForm } from './helpers/config.util'
import { PropertyProps } from './types'

interface ComponentFlexPropertyProps extends PropertyProps {
  labelClass?: string
}

type FlexDataFunc = (cdir: string) => { [k: string]: boolean | undefined }

interface FlexData {
  value: string
  icon: string
  classList?: FlexDataFunc
}

const direction: FlexData[] = [
  { value: 'row', icon: 'flex-direction' },
  { value: 'row-reverse', icon: 'flex-direction' },
  { value: 'column', icon: 'flex-direction' },
  { value: 'column-reverse', icon: 'flex-direction' }
]

const wrap: FlexData[] = [
  { value: 'nowrap', icon: 'flex-nowrap' },
  { value: 'wrap', icon: 'flex-wrap' }
]

const align: FlexData[] = [
  {
    value: 'start',
    icon: 'align-start',
    classList: (cdir) => ({
      'rotate-180': ['row', 'row-reverse'].includes(cdir),
      'rotate-90': ['column', 'column-reverse'].includes(cdir)
    })
  },
  {
    value: 'center',
    icon: 'align-center',
    classList: (cdir) => ({ 'rotate-90': ['row', 'row-reverse'].includes(cdir) })
  },
  {
    value: 'end',
    icon: 'align-start',
    classList: (cdir) => ({ '-rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'stretch',
    icon: 'align-stretch',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  }
]

const justify: FlexData[] = [
  {
    value: 'start',
    icon: 'justify-start',
    classList: (cdir) => ({
      'rotate-90': ['column'].includes(cdir),
      '-rotate-90': ['column-reverse'].includes(cdir),
      'rotate-180': ['row-reverse'].includes(cdir)
    })
  },
  {
    value: 'center',
    icon: 'justify-center',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'end',
    icon: 'justify-start',
    classList: (cdir) => ({
      'rotate-180': ['row', 'reverse'].includes(cdir),
      '-rotate-90': ['column'].includes(cdir),
      'rotate-90': ['column-reverse'].includes(cdir)
    })
  },
  {
    value: 'between',
    icon: 'justify-between',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'around',
    icon: 'justify-around',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'evenly',
    icon: 'justify-evenly',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  }
]

const ComponentFlexProperty: Component<ComponentFlexPropertyProps> = (
  props: ComponentFlexPropertyProps
) => {
  const form = useConfigForm(
    {
      direction: { value: '' },
      wrap: { value: '' },
      align: { value: '' },
      justify: { value: '' }
    },
    props
  )
  const currentDirection = createMemo(() => (form.value.direction as string) ?? '')
  return (
    <ComponentProperty label="Flex layout" index={props.index} path={props.path}>
      <div class="px-2 pb-2 flex flex-col gap-1">
        <section class="flex gap-4 items-center">
          <h1 class="basis-16 opacity-70">Direction</h1>
          <RadioGroup label="Direction group" class="grid-cols-4">
            <For each={direction}>
              {(item): JSX.Element => (
                <RadioButton
                  control={form.controls.direction}
                  label={item.value}
                  value={item.value}
                >
                  <Icon
                    icon={item.icon}
                    class="w-4 h-4"
                    classList={{
                      '-rotate-90': item.value === 'row',
                      '-rotate-180': item.value === 'column-reverse',
                      'rotate-90': item.value === 'row-reverse'
                    }}
                  />
                </RadioButton>
              )}
            </For>
          </RadioGroup>
          <RadioGroup label="Wrap group" class="grid-cols-2">
            <For each={wrap}>
              {(item): JSX.Element => (
                <RadioButton control={form.controls.wrap} label={item.value} value={item.value}>
                  <Icon
                    icon={item.icon}
                    class="w-4 h-4 transition-transform"
                    classList={item.classList ? item.classList(currentDirection()) : {}}
                  />
                </RadioButton>
              )}
            </For>
          </RadioGroup>
        </section>
        <section class="flex gap-4 items-center">
          <h1 class="basis-16 opacity-70">Align</h1>
          <RadioGroup label="Align group" class="flex-1 grid-cols-4">
            <For each={align}>
              {(item): JSX.Element => (
                <RadioButton control={form.controls.align} label={item.value} value={item.value}>
                  <Icon
                    icon={item.icon}
                    class="w-4 h-4 transition-transform"
                    classList={item.classList ? item.classList(currentDirection()) : {}}
                  />
                </RadioButton>
              )}
            </For>
          </RadioGroup>
        </section>
        <section class="flex gap-4">
          <h1 class="basis-16 opacity-70">Justify</h1>
          <RadioGroup label="Justify group" class="flex-1 grid-cols-3">
            <For each={justify}>
              {(item): JSX.Element => (
                <RadioButton control={form.controls.justify} label={item.value} value={item.value}>
                  <Icon
                    icon={item.icon}
                    class="w-4 h-4 transition-transform"
                    classList={item.classList ? item.classList(currentDirection()) : {}}
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

export default ComponentFlexProperty
