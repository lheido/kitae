import { FormControl } from '@renderer/features/form'
import { Component, ComponentProps, createMemo, splitProps } from 'solid-js'

interface TextInputProps extends ComponentProps<'input'> {
  control: FormControl<unknown>
}

const TextInput: Component<TextInputProps> = (props: TextInputProps) => {
  const [component, others] = splitProps(props, ['control'])
  const id = crypto.randomUUID()
  const value = createMemo(() => component.control.value as string)
  return (
    <input
      type="text"
      id={id}
      name={id}
      {...others}
      value={value()}
      onInput={(e): void => {
        component.control.patchValue(e.currentTarget.value, true)
        if (!component.control.valid) {
          const errorMessages = Object.values(component.control.errors!)
          e.currentTarget.setCustomValidity(errorMessages.join('\n'))
        } else {
          e.currentTarget.setCustomValidity('')
        }
      }}
    />
  )
}

export default TextInput
