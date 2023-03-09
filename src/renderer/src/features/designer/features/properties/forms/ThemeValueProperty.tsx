/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'

import './helpers/update-value-property'

interface ValueFormState {
  value: string
}

interface ValuePropertyProps {
  label?: string
  labelClass?: string
}

const ThemeValueProperty: Component<ValuePropertyProps> = (props: ValuePropertyProps) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
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
    makeChange({
      path,
      changes: [(walker(state.data, path) as any).value, data],
      handler: DesignerHistoryHandlers.UPDATE_VALUE_PROPERTY
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
