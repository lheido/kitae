import { FormControl } from '@renderer/features/form'
import { Component, ComponentProps, splitProps } from 'solid-js'

interface TextareaProps extends ComponentProps<'textarea'> {
  control: FormControl<unknown>
}

const Textarea: Component<TextareaProps> = (props: TextareaProps) => {
  const [component, others] = splitProps(props, ['control'])
  const id = crypto.randomUUID()
  return (
    <textarea
      id={id}
      name={id}
      {...others}
      value={component.control.value as string}
      onInput={(e): void => {
        component.control.patchValue(e.currentTarget.value, true)
      }}
    />
  )
}

export default Textarea
