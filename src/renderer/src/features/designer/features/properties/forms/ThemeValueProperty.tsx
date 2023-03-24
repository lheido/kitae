/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { makeUpdateValuePropertyChange } from '../../history/theme.events'
import { useDesignerState } from '../../state/designer.state'
import { walker } from '../../utils/walker.util'

interface ValueFormState {
  value: string
}

interface ValuePropertyProps {
  label?: string
  labelClass?: string
}

const ThemeValueProperty: Component<ValuePropertyProps> = (props: ValuePropertyProps) => {
  const [state] = useDesignerState()
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ValueFormState>()
  createEffect(() => {
    const path = JSON.parse(JSON.stringify(state.current))
    const basePath = [...path]
    basePath.splice(1, 2)
    setForm({
      value: walker(state.data, path) ?? walker(state.data, basePath) ?? ''
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    makeUpdateValuePropertyChange({
      path,
      changes: [(walker(state.data, path) as any).value, data]
    })
  }, 250)
  const onSubmit = (form: ValueFormState): void => {
    updateHandler.clear()
    updateHandler(form.value)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <div class="p-2">
          <FormField label={props.label ?? 'Value'} labelClass={props.labelClass}>
            <input
              type="text"
              name="value"
              id="value-property-input"
              // @ts-ignore - solid directive
              use:field
            />
          </FormField>
        </div>
      </section>
    </FormProvider>
  )
}

export default ThemeValueProperty
