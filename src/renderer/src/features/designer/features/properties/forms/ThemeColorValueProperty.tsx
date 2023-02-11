/* eslint-disable @typescript-eslint/no-explicit-any */
import ColorPicker from '@renderer/components/form/ColorPicker'
import FormField from '@renderer/components/form/FormField'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import Color from 'color'
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

const ValueProperty: Component<ValuePropertyProps> = (props: ValuePropertyProps) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field,
    setShouldSubmit
  } = createForm<ValueFormState>()
  createEffect(() => {
    const path = JSON.parse(JSON.stringify(state.current))
    const basePath = [...path]
    basePath.splice(1, 2)
    setForm({
      value: Color(walker(state.data, path) ?? walker(state.data, basePath) ?? '#000').hex()
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    makeChange({
      path,
      changes: [walker(state.data, path) as any, data],
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
        <div class="p-2 flex flex-col gap-2">
          <div class="w-full h-12 rounded-lg" style={{ background: form.value }} />
          <ColorPicker
            color={form.value}
            onColorChanged={(c): void => {
              setForm('value', c)
              // valueRef?.classList.remove('!border-error')
              setShouldSubmit(true)
            }}
          />
          {/* <FormField label="Color">
            <input
              ref={valueRef}
              type="text"
              name="value"
              id="theme-color-value-input"
              value={form.value && Color(form.value).hex()}
              onInput={(e): void => {
                try {
                  setForm('value', Color(e.currentTarget.value).hex())
                  setShouldSubmit(true)
                  valueRef?.classList.remove('!border-error')
                } catch (error) {
                  valueRef?.classList.add('!border-error')
                }
              }}
            />
          </FormField> */}
          <FormField label={props.label ?? 'Value'} labelClass={props.labelClass}>
            <input
              type="text"
              name="value"
              id="color-value-property-input"
              // @ts-ignore - solid directive
              use:field
            />
          </FormField>
        </div>
      </section>
    </FormProvider>
  )
}

export default ValueProperty
