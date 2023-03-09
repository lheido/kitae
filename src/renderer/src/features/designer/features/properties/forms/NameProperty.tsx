/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'

interface NameFormState {
  name: string
}

interface NamePropertyProps {
  labelClass?: string
}

const [state, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_NAME_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [any, any])[1]
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.name = (changes as [any, any])[0]
      })
    }
  }
})

const NameProperty: Component<NamePropertyProps> = (props: NamePropertyProps) => {
  const [, { makeChange }] = useHistory()
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
    makeChange({
      path,
      changes: [(walker(state.data, path) as any).name, data],
      handler: DesignerHistoryHandlers.UPDATE_NAME_PROPERTY
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
