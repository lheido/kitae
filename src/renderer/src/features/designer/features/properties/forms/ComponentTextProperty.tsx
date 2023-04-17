/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo } from 'solid-js'
import { makeUpdateTextConfigPropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'
import ComponentConfigRemove from './helpers/ComponentConfigRemove'
import { PropertyProps } from './types'

interface ComponentTextFormState {
  text: string
}

interface ComponentTextPropertyProps extends PropertyProps {
  labelClass?: string
}

const [state] = useDesignerState()

const ComponentTextProperty: Component<ComponentTextPropertyProps> = (
  props: ComponentTextPropertyProps
) => {
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentTextFormState>()
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
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
    makeUpdateTextConfigPropertyChange({
      path: _path,
      changes: [previous, data]
    })
  }, 250)
  const onSubmit = (form: ComponentTextFormState): void => {
    updateHandler.clear()
    updateHandler(form)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <div class="py-2 pl-2 flex">
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
          <ComponentConfigRemove path={props.path} />
        </div>
      </section>
    </FormProvider>
  )
}

export default ComponentTextProperty
