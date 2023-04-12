/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { walker } from '@renderer/features/utils/walker.util'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { makeUpdateNamePropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'

interface NameFormState {
  name: string
}

interface NamePropertyProps {
  labelClass?: string
}

const [state] = useDesignerState()

const NameProperty: Component<NamePropertyProps> = (props: NamePropertyProps) => {
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<NameFormState>()
  createEffect(() => {
    const data = walker(state.data, state.current) as any
    setForm({
      name: data?.name ?? ''
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    makeUpdateNamePropertyChange({
      path,
      changes: [(walker(state.data, path) as any).name, data]
    })
  }, 250)
  const onSubmit = (form: NameFormState): void => {
    updateHandler.clear()
    updateHandler(form.name)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <div class="p-2">
          <FormField label="Name" labelClass={props.labelClass}>
            <input
              type="text"
              name="name"
              id="name-property-input"
              // @ts-ignore - solid directive
              use:field
            />
          </FormField>
        </div>
      </section>
    </FormProvider>
  )
}

export default NameProperty
