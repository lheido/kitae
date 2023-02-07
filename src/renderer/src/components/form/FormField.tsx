import { Component, ComponentProps, createSignal, onMount, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

interface FormFieldProps extends ComponentProps<'div'> {
  label: string
  labelClass?: string
  required?: boolean
}

const FormField: Component<FormFieldProps> = (props: FormFieldProps) => {
  let fieldRef: HTMLDivElement | undefined
  const [component, classes, container] = splitProps(
    props,
    ['label', 'required', 'children'],
    ['class', 'labelClass']
  )
  const [labelFor, setLabelFor] = createSignal('')
  onMount(() => {
    if (fieldRef) {
      const input = fieldRef.querySelector('input')
      if (input) {
        setLabelFor(input.id)
      }
    }
  })
  return (
    <div ref={fieldRef} {...container} class={twMerge('flex gap-2 items-start', classes.class)}>
      <label class={twMerge('basis-10 py-1', classes.labelClass)} for={labelFor()}>
        {component.label}
      </label>
      {component.children}
    </div>
  )
}

export default FormField
