/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig, ComponentData } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers, WorkspaceDataState } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import { PropertyProps } from './types'

interface ComponentTextFormState {
  text: string
}

interface ComponentTextPropertyProps extends PropertyProps {
  labelClass?: string
}

const [state, { updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.UPDATE_TEXT_CONFIG_PROPERTY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig, _, s: WorkspaceDataState): void => {
        current.data = (changes as [any, any])[1].text
        const parent = walker(s.data, path.slice(0, -2)) as ComponentData
        parent.name = current.data as string
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (current: ComponentConfig, _, s: WorkspaceDataState): void => {
        current.data = (changes as [any, any])[0].text
        const parent = walker(s.data, path.slice(0, -2)) as ComponentData
        parent.name = current.data as string
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
  const path = createMemo(() => [...state.current, 'config', props.index])
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  createEffect(() => {
    setForm({
      text: (config()?.data as string) ?? ''
    })
  })
  // eslint-disable-next-line solid/reactivity
  const updateHandler = debounce((data: unknown) => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(
      JSON.stringify({ text: (walker(state.data, _path) as ComponentConfig)?.data } ?? {})
    )
    makeChange({
      path: _path,
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
