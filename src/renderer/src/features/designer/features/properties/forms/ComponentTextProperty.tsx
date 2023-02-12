/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentData } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'

interface ComponentTextFormState {
  text: string
}

interface ComponentTextPropertyProps {
  labelClass?: string
}

const [state, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_TEXT_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.config = { ...current.config, ...(changes as [any, any])[1] }
        current.name = current.config.text
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: any): void => {
        current.config = { ...current.config, ...(changes as [any, any])[0] }
        current.name = current.config.text
      })
    }
  }
})

const ComponentTextProperty: Component<ComponentTextPropertyProps> = (
  props: ComponentTextPropertyProps
) => {
  const [, { makeChange }] = useHistory()
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentTextFormState>()
  const data = createMemo(() => walker(state.data, state.current) as ComponentData)
  createEffect(() => {
    setForm({
      text: data()?.config?.text ?? ''
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(
      JSON.stringify({ text: (walker(state.data, path) as ComponentData).config?.text } ?? {})
    )
    makeChange({
      path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_TEXT_CONFIG_PROPERTY
    })
  }, 250)
  const onSubmit = (form: ComponentTextFormState): void => {
    updateHandler.clear()
    updateHandler(form)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <div class="p-2">
          <FormField label="Text" labelClass={props.labelClass}>
            <textarea
              name="text"
              id="component-text-property-input"
              cols="30"
              rows="3"
              // @ts-ignore - solid directive
              use:field
            />
          </FormField>
        </div>
      </section>
    </FormProvider>
  )
}

export default ComponentTextProperty
