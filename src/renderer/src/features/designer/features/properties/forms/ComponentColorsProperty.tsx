import { Path } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import RangeInput from '@renderer/components/form/RangeInput'
import { labelMap } from '@renderer/features/designer/label-map'
import { createFormControl } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, Show, createEffect, createMemo } from 'solid-js'
import { makeUpdateConfigPropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'
import ComponentProperty from './helpers/ComponentProperty'
import { getConfig, getUpdateData } from './helpers/config.util'
import { getSpecificTheme, getThemePropertyOptions } from './helpers/theme.util'
import { PropertyProps } from './types'

interface ComponentColorsPropertyProps extends PropertyProps {
  labelClass?: string
  prefix: 'backgroundColor' | 'color'
}

const defaultValue = 'none'

const ComponentColorsProperty: Component<ComponentColorsPropertyProps> = (
  props: ComponentColorsPropertyProps
) => {
  const [state] = useDesignerState()
  const colors = getThemePropertyOptions('colors', () => 0)
  const colorOptions = createMemo(() => [defaultValue, ...colors()])
  const control = createFormControl({ value: '' })
  const config = getConfig(props)
  createEffect((prev) => {
    const value = config()?.data
    if (prev !== value && !control.touched) {
      control.patchValue(value ?? '', false)
    }
    return value
  })
  const updateHandlerRef = debounce((p: Path, previous: unknown, data: unknown) => {
    makeUpdateConfigPropertyChange({
      path: p,
      changes: [previous, data]
    })
  }, 250)
  createEffect((prev: string | undefined) => {
    const value = JSON.stringify(control.value)
    if (prev !== undefined && control.touched && control.valid && prev !== value) {
      updateHandlerRef.clear()
      const [p, previous] = getUpdateData(props)
      updateHandlerRef(p, previous, JSON.parse(value))
    }
    return value
  })
  const currentBgColor = createMemo(() => {
    const specificTheme = getSpecificTheme(props)
    const key = control.value as string
    const value =
      state.data?.theme?.extends?.[specificTheme!]?.colors?.[key] ??
      state.data?.theme?.colors?.[key]
    return value
  })
  return (
    <ComponentProperty
      index={props.index}
      path={props.path}
      label={labelMap[props.prefix] ?? props.prefix}
      headerSlot={
        <Show when={control.value && control.value !== defaultValue}>
          <span
            aria-hidden="true"
            class="w-5 h-5 block rounded-full bg-base-300"
            style={{
              background: currentBgColor()
            }}
          />
        </Show>
      }
    >
      <div class="p-2">
        <FormField label="Color" class="items-center py-2 px-1" labelClass="sr-only">
          <RangeInput control={control} options={colorOptions()} />
        </FormField>
      </div>
    </ComponentProperty>
  )
}

export default ComponentColorsProperty
