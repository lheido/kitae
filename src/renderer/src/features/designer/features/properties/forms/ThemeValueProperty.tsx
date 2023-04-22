import { ComponentData, Path } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import FormField from '@renderer/components/form/FormField'
import TextInput from '@renderer/components/form/TextInput'
import { createFormControl } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo } from 'solid-js'
import { makeUpdateValuePropertyChange } from '../../history/theme.events'
import { useDesignerState } from '../../state/designer.state'

interface ValuePropertyProps {
  label?: string
  labelClass?: string
}

const ThemeValueProperty: Component<ValuePropertyProps> = (props: ValuePropertyProps) => {
  const [state] = useDesignerState()
  const control = createFormControl({ value: '' })
  const data = createMemo(() => {
    const value = walker(state.data, state.current) as string
    control.set({ value, disabled: false, touched: false, initial: '' })
    return value
  })
  createEffect((prev) => {
    const value = data()
    if (prev !== value && !control.touched) {
      control.patchValue(value ?? '', false)
    }
    return value
  })
  const updateHandlerRef = debounce((p: Path, previous: string, data: string) => {
    makeUpdateValuePropertyChange({
      path: p,
      changes: [previous, data]
    })
  }, 250)
  createEffect((prev: string | undefined) => {
    const value = control.value as string
    if (prev !== undefined && control.touched && control.valid && prev !== value) {
      updateHandlerRef.clear()
      const p = JSON.parse(JSON.stringify(state.current))
      updateHandlerRef(p, (walker(state.data, p) as ComponentData).name, value)
    }
    return value
  })
  return (
    <section class="bg-base-200 rounded-lg">
      <div class="p-2">
        <FormField label={props.label ?? 'Value'} labelClass={props.labelClass}>
          <TextInput control={control} />
        </FormField>
      </div>
    </section>
  )
}

export default ThemeValueProperty
