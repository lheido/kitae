import Icon from '@renderer/components/Icon'
import FormField from '@renderer/components/form/FormField'
import RangeInput from '@renderer/components/form/RangeInput'
import { Component, Match, Switch, createEffect, createSignal } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { useConfigForm } from './helpers/config.util'
import { getThemePropertyOptions } from './helpers/theme.util'
import { PropertyProps } from './types'

interface ComponentSpacingPropertyProps extends PropertyProps {
  labelClass?: string
  prefix: 'padding' | 'margin'
}

const ComponentSpacingProperty: Component<ComponentSpacingPropertyProps> = (
  props: ComponentSpacingPropertyProps
) => {
  const [isIndependent, setIsIndependent] = createSignal(false)
  const spacingOptions = getThemePropertyOptions('spacing')
  const form = useConfigForm(
    {
      left: { value: '' },
      right: { value: '' },
      top: { value: '' },
      bottom: { value: '' }
    },
    props
  )
  createEffect(() => {
    if (!isIndependent() && form.controls.left) {
      form.controls.right.patchValue(form.controls.left.value, true)
    }
    if (!isIndependent() && form.controls.top) {
      form.controls.bottom.patchValue(form.controls.top.value, true)
    }
  })

  return (
    <ComponentProperty
      index={props.index}
      path={props.path}
      label={props.prefix === 'padding' ? 'Padding' : 'Margin'}
      headerSlot={
        <label>
          <span class="sr-only">
            {props.prefix === 'padding' ? 'Independent paddings' : 'Independent margins'}
          </span>
          <input
            type="checkbox"
            name={`toggle-${props.prefix}`}
            class="sr-only"
            checked={isIndependent()}
            onClick={(e): void => {
              setIsIndependent(e.currentTarget.checked)
            }}
          />
          <div
            class="p-2 rounded hover:bg-base-300"
            classList={{ '!bg-secondary !bg-opacity-50': isIndependent() }}
          >
            <Icon icon="spacing" class="h-3 w-3" />
          </div>
        </label>
      }
    >
      <div class="p-2">
        <Switch>
          <Match when={!isIndependent()}>
            <FormField
              label={
                <>
                  <span class="sr-only">x</span>
                  <Icon icon="spacing-y" class="w-5 h-5 rotate-90" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.left} options={spacingOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">y</span>
                  <Icon icon="spacing-y" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.top} options={spacingOptions()} />
            </FormField>
          </Match>
          <Match when={isIndependent()}>
            <FormField
              label={
                <>
                  <span class="sr-only">left</span>
                  <Icon icon="spacing-top" class="w-5 h-5 -rotate-90" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.left} options={spacingOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">right</span>
                  <Icon icon="spacing-top" class="w-5 h-5 rotate-90" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.right} options={spacingOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">top</span>
                  <Icon icon="spacing-top" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.top} options={spacingOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">bottom</span>
                  <Icon icon="spacing-top" class="w-5 h-5 rotate-180" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.bottom} options={spacingOptions()} />
            </FormField>
          </Match>
        </Switch>
      </div>
    </ComponentProperty>
  )
}

export default ComponentSpacingProperty
