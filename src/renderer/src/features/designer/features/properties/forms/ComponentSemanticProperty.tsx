import { Path } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import TextInput from '@renderer/components/form/TextInput'
import { ValidationError, createFormControl } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect } from 'solid-js'
import { makeUpdateConfigPropertyChange } from '../../history/property.events'
import ComponentConfigRemove from './helpers/ComponentConfigRemove'
import { getConfig, getUpdateData } from './helpers/config.util'
import { PropertyProps } from './types'

interface ComponentSemanticPropertyProps extends PropertyProps {
  labelClass?: string
}

const htmlTags = '[a-zA-Z]+[a-zA-Z0-9-_:.]*'
const htmlRegex = new RegExp(htmlTags)

const ComponentSemanticProperty: Component<ComponentSemanticPropertyProps> = (
  props: ComponentSemanticPropertyProps
) => {
  const control = createFormControl({
    value: '',
    validators: [
      (v): ValidationError =>
        htmlRegex.test(v as string) ? undefined : { htmlTags: 'Invalid HTML tag name' }
    ]
  })
  const config = getConfig(props)
  createEffect((prev) => {
    const value = config()?.data as string
    if (prev !== value && !control.touched) {
      control.patchValue(value ?? 'div', false)
    }
    return value
  })
  const updateHandlerRef = debounce((p: Path, previous: unknown, data: unknown) => {
    makeUpdateConfigPropertyChange({
      path: p,
      changes: [previous, data]
    })
  }, 250)
  createEffect((prev: string | undefined) => {
    const value = JSON.stringify(control.value)
    if (prev !== undefined && control.touched && control.valid && prev !== value) {
      updateHandlerRef.clear()
      const [p, previous] = getUpdateData(props)
      updateHandlerRef(p, previous, JSON.parse(value))
    }
    return value
  })
  return (
    <section class="bg-base-200 rounded-lg">
      <div class="p-2 flex items-center gap-2">
        <FormField label="Semantic" class="flex-1" labelClass={props.labelClass}>
          <TextInput control={control} pattern={htmlTags} />
        </FormField>
        <ComponentConfigRemove path={props.path} />
      </div>
    </section>
  )
}

export default ComponentSemanticProperty
