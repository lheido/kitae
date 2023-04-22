import Icon from '@renderer/components/Icon'
import FormField from '@renderer/components/form/FormField'
import RadioButton from '@renderer/components/form/RadioButton'
import RadioGroup from '@renderer/components/form/RadioGroup'
import RangeInput from '@renderer/components/form/RangeInput'
import { Component, For, JSX, createEffect } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { useConfigForm } from './helpers/config.util'
import { getThemePropertyOptions } from './helpers/theme.util'
import { PropertyProps } from './types'

interface ComponentSizingPropertyProps extends PropertyProps {
  labelClass?: string
  prefix: 'width' | 'height'
}

const defaultValue = ''

const quickSizing = [
  { value: defaultValue, label: 'Default' },
  { value: 'full', label: 'Full' },
  { value: 'screen', label: 'Screen' }
]

const ComponentSizingProperty: Component<ComponentSizingPropertyProps> = (
  props: ComponentSizingPropertyProps
) => {
  const sizingOptions = getThemePropertyOptions('sizing', (a, b) => {
    const minus = Number(a) - Number(b)
    return !Number.isNaN(minus) ? minus : Number.isNaN(Number(a)) ? 1 : -1
  })
  const form = useConfigForm(
    {
      quick: { value: '' },
      size: { value: '' }
    },
    props
  )
  createEffect(() => {
    form.controls.size.setDisabled(form.controls.quick.value !== defaultValue)
  })
  return (
    <ComponentProperty
      index={props.index}
      path={props.path}
      label={props.prefix === 'width' ? 'Width' : 'Height'}
    >
      <div class="pb-2 px-4 flex flex-col gap-2">
        <section class="flex gap-2 items-center">
          <h1 class="basis-16">Specific</h1>
          <RadioGroup label="Quick sizing" class="w-full grid-cols-3">
            <For each={quickSizing}>
              {(item): JSX.Element => (
                <RadioButton control={form.controls.quick} label={item.label} value={item.value}>
                  {item.label}
                </RadioButton>
              )}
            </For>
          </RadioGroup>
        </section>
        <FormField
          label={
            <>
              <span class="sr-only">Size</span>
              <Icon icon={props.prefix} class="w-5 h-5" />
            </>
          }
          class="items-center pl-1 pr-0.5"
          labelClass="basis-0"
        >
          <RangeInput control={form.controls.size} options={sizingOptions()} />
        </FormField>
      </div>
    </ComponentProperty>
  )
}

export default ComponentSizingProperty
