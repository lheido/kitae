import Icon from '@renderer/components/Icon'
import FormField from '@renderer/components/form/FormField'
import RangeInput from '@renderer/components/form/RangeInput'
import { Component, Match, Switch, createEffect, createSignal } from 'solid-js'
import ComponentProperty from './helpers/ComponentProperty'
import { useConfigForm } from './helpers/config.util'
import { getThemePropertyOptions } from './helpers/theme.util'
import { PropertyProps } from './types'

interface ComponentRoundedPropertyProps extends PropertyProps {
  labelClass?: string
}

const ComponentRoundedProperty: Component<ComponentRoundedPropertyProps> = (
  props: ComponentRoundedPropertyProps
) => {
  const [isIndependent, setIsIndependent] = createSignal(false)
  const roundedOptions = getThemePropertyOptions('rounded')
  const form = useConfigForm(
    {
      tl: { value: '' },
      tr: { value: '' },
      bl: { value: '' },
      br: { value: '' }
    },
    props
  )
  createEffect(() => {
    if (!isIndependent() && form.controls.tl) {
      form.controls.tr.patchValue(form.controls.tl.value, true)
      form.controls.br.patchValue(form.controls.tl.value, true)
      form.controls.bl.patchValue(form.controls.tl.value, true)
    }
  })
  return (
    <ComponentProperty
      label="Rounded"
      index={props.index}
      path={props.path}
      headerSlot={
        <label>
          <span class="sr-only">Independent corner radius</span>
          <input
            type="checkbox"
            name={`toggle-rounded`}
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
            <Icon icon="border-radius" class="h-3 w-3" />
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
                  <Icon icon="border-radius" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.tl} options={roundedOptions()} />
            </FormField>
          </Match>
          <Match when={isIndependent()}>
            <FormField
              label={
                <>
                  <span class="sr-only">tl</span>
                  <Icon icon="border-radius-bottom-left" class="w-5 h-5 rotate-90" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.tl} options={roundedOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">tr</span>
                  <Icon icon="border-radius-bottom-left" class="w-5 h-5 rotate-180" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.tr} options={roundedOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">bl</span>
                  <Icon icon="border-radius-bottom-left" class="w-5 h-5" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.bl} options={roundedOptions()} />
            </FormField>
            <FormField
              label={
                <>
                  <span class="sr-only">br</span>
                  <Icon icon="border-radius-bottom-left" class="w-5 h-5 -rotate-90" />
                </>
              }
              class="items-center pl-1 pr-0.5"
              labelClass="basis-0"
            >
              <RangeInput control={form.controls.br} options={roundedOptions()} />
            </FormField>
          </Match>
        </Switch>
      </div>
    </ComponentProperty>
  )
}

export default ComponentRoundedProperty
