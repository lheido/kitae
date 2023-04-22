import { ComponentData, Path } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import FormField from '@renderer/components/form/FormField'
import TextInput from '@renderer/components/form/TextInput'
import { createFormControl } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo } from 'solid-js'
import { makeUpdateNamePropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'

interface NamePropertyProps {
  labelClass?: string
}

const NameProperty: Component<NamePropertyProps> = (props: NamePropertyProps) => {
  const [state] = useDesignerState()
  const control = createFormControl({ value: '' })
  const name = createMemo(() => {
    const path = JSON.parse(JSON.stringify(state.current))
    const value = (walker(state.data, path) as ComponentData)?.name ?? ''
    control.set({ value, disabled: false, touched: false, initial: '' })
    return value
  })
  createEffect((prev) => {
    const value = name()
    if (prev !== value && !control.touched) {
      control.patchValue(value ?? '', false)
    }
    return value
  })
  const updateHandlerRef = debounce((p: Path, previous: string, data: string) => {
    makeUpdateNamePropertyChange({
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
        <FormField label="Name" labelClass={props.labelClass}>
          <TextInput control={control} />
        </FormField>
      </div>
    </section>
  )
}

export default NameProperty
