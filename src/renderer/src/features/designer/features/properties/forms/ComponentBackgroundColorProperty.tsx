/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import './helpers/update-config-properties'

interface BackgroundColorFormState {
  backgroundColor: string
}

interface BackgroundColorPropertyProps {
  labelClass?: string
}

const BackgroundColorProperty: Component<BackgroundColorPropertyProps> = (
  props: BackgroundColorPropertyProps
) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<BackgroundColorFormState>()
  createEffect(() => {
    const data = walker(state.data, state.current) as any
    // TODO
    setForm({
      backgroundColor: data?.name ?? ''
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    makeChange({
      path,
      changes: [(walker(state.data, path) as any).name, data],
      handler: DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY
    })
  }, 250)
  const onSubmit = (form: BackgroundColorFormState): void => {
    updateHandler.clear()
    updateHandler(form.backgroundColor)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <div class="p-2">
          <FormField label="Background color" labelClass={props.labelClass}>
            <input
              type="text"
              name="backgroundColor"
              id="component-background-property-input"
              // @ts-ignore - solid directive
              use:field
            />
          </FormField>
        </div>
      </section>
    </FormProvider>
  )
}

export default BackgroundColorProperty
