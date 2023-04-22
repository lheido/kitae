import Icon from '@renderer/components/Icon'
import FormField from '@renderer/components/form/FormField'
import RangeInput from '@renderer/components/form/RangeInput'
import { Component, Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { getSiblingConfigs, useConfigForm } from './helpers/config.util'
import { getThemePropertyOptions } from './helpers/theme.util'
import { PropertyProps } from './types'

interface ComponentGapPropertyProps extends PropertyProps {
  labelClass?: string
}

const ComponentGapProperty: Component<ComponentGapPropertyProps> = (
  props: ComponentGapPropertyProps
) => {
  const [allowIndependent, setAllowIndependent] = createSignal(false)
  const [isIndependent, setIsIndependent] = createSignal(false)
  const spacingOptions = getThemePropertyOptions('spacing')
  const form = useConfigForm(
    {
      x: { value: '' },
      y: { value: '' }
    },
    props
  )
  createEffect(() => {
    const otherConfigs = getSiblingConfigs(props)
    setAllowIndependent(!!otherConfigs().find((c) => c.type === 'grid'))
  })
  createEffect(() => {
    if (!isIndependent() && form.controls.x) {
      form.controls.y.patchValue(form.controls.x.value, true)
    }
  })
  return (
    <ComponentProperty
      index={props.index}
      path={props.path}
      label="Gap"
      headerSlot={
        <Show when={allowIndependent()}>
          <label>
            <span class="sr-only">Independent gaps</span>
            <input
              type="checkbox"
              name={crypto.randomUUID()}
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
              <Icon icon="gap" class="h-3 w-3" />
            </div>
          </label>
        </Show>
      }
    >
      <div class="py-2 pl-2 pr-4">
        <Switch>
          <Match when={!isIndependent()}>
            <FormField
              label={
                <>
                  <span class="sr-only">Gap</span>
                  <Icon icon="gap-x" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.x} options={spacingOptions()} />
            </FormField>
          </Match>
          <Match when={isIndependent()}>
            <FormField
              label={
                <>
                  <span class="sr-only">x</span>
                  <Icon icon="gap-x" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.x} options={spacingOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">y</span>
                  <Icon icon="gap-y" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.y} options={spacingOptions()} />
            </FormField>
          </Match>
        </Switch>
      </div>
    </ComponentProperty>
  )
}

export default ComponentGapProperty
