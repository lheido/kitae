import { Path } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import ColorPicker from '@renderer/components/form/ColorPicker'
import FormField from '@renderer/components/form/FormField'
import TextInput from '@renderer/components/form/TextInput'
import { Validators, createFormControl } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import Color from 'color'
import { Component, createEffect, createMemo } from 'solid-js'
import { makeUpdateValuePropertyChange } from '../../history/theme.events'
import { useDesignerState } from '../../state/designer.state'

interface ValuePropertyProps {
  label?: string
  labelClass?: string
}

const ValueProperty: Component<ValuePropertyProps> = (props: ValuePropertyProps) => {
  const [state] = useDesignerState()
  const control = createFormControl({ value: '', validators: [Validators.color] })
  const data = createMemo(() => {
    const value = walker(state.data, state.current) as string
    control.set({ value, disabled: false, touched: false, initial: '' })
    return value
  })
  createEffect((prev) => {
    const color = data()
    if (prev !== color && !control.touched) {
      try {
        control.patchValue(Color(color).hex(), false)
      } catch {
        control.patchValue('#000', false)
      }
    }
    return color
  })
  const updateHandlerRef = debounce((p: Path, previous: string, data: string) => {
    makeUpdateValuePropertyChange({
      path: p,
      changes: [previous, data]
    })
  }, 250)
  createEffect((prev: string | undefined) => {
    const value = control.value as string
    if (prev !== undefined && control.touched && control.valid && prev !== value) {
      updateHandlerRef.clear()
      const p = JSON.parse(JSON.stringify(state.current))
      updateHandlerRef(p, walker(state.data, p) as string, value)
    }
    return value
  })
  // const [state] = useDesignerState()
  // const {
  //   form,
  //   setForm,
  //   FormProvider,
  //   //@ts-ignore - solid directives
  //   field,
  //   setShouldSubmit
  // } = createForm<ValueFormState>()
  // createEffect(() => {
  //   const path = JSON.parse(JSON.stringify(state.current))
  //   const basePath = [...path]
  //   basePath.splice(1, 2)
  //   setForm({
  //     value: Color(walker(state.data, path) ?? walker(state.data, basePath) ?? '#000').hex()
  //   })
  // })
  // const updateHandler = debounce((data: unknown) => {
  //   const path = JSON.parse(JSON.stringify(state.current))
  //   makeUpdateValuePropertyChange({
  //     path,
  //     changes: [walker(state.data, path) as any, data]
  //   })
  // }, 250)
  // const onSubmit = (form: ValueFormState): void => {
  //   updateHandler.clear()
  //   updateHandler(form.value)
  // }
  return (
    <section class="bg-base-200 rounded-lg">
      <div class="p-2 flex flex-col gap-2">
        <div class="w-full h-12 rounded-lg" style={{ background: control.value as string }} />
        <ColorPicker control={control} />
        <FormField label={props.label ?? 'Value'} labelClass={props.labelClass}>
          <TextInput control={control} />
        </FormField>
      </div>
    </section>
  )
}

export default ValueProperty
