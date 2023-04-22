import FormField from '@renderer/components/form/FormField'
import Textarea from '@renderer/components/form/Textarea'
import { Component, createEffect, createMemo } from 'solid-js'
import { makeUpdateTextConfigPropertyChange } from '../../history/property.events'
import ComponentConfigRemove from './helpers/ComponentConfigRemove'
import { getConfig, useConfigForm } from './helpers/config.util'
import { PropertyProps } from './types'

interface ComponentTextPropertyProps extends PropertyProps {
  labelClass?: string
}

const ComponentTextProperty: Component<ComponentTextPropertyProps> = (
  props: ComponentTextPropertyProps
) => {
  const form = useConfigForm(
    {
      text: { value: '' }
    },
    props,
    { init: false, submitHandler: makeUpdateTextConfigPropertyChange }
  )
  const config = getConfig(props)
  const value = createMemo(() => {
    return config()?.data as string
  })
  // Custom init
  createEffect((prev) => {
    const v = value()
    if (prev !== v && !form.touched) {
      form.controls.text.patchValue(v ?? '', false)
    }
    return v
  })
  return (
    <section class="bg-base-200 rounded-lg">
      <div class="py-2 pl-2 flex">
        <FormField label="Text" labelClass={props.labelClass}>
          <Textarea
            control={form.controls.text}
            cols="30"
            rows="3"
            onBlur={(): void => {
              form.controls.text.set('touched', false)
            }}
          />
        </FormField>
        <ComponentConfigRemove path={props.path} />
      </div>
    </section>
  )
}

export default ComponentTextProperty
