import { FormControl } from '@renderer/features/form'
import { Component, ComponentProps, splitProps } from 'solid-js'

interface RadioButtonProps extends ComponentProps<'label'> {
  control: FormControl<unknown>
  value?: string
  label: string
}

const RadioButton: Component<RadioButtonProps> = (props: RadioButtonProps) => {
  const [input, component] = splitProps(props, ['value', 'label'])
  return (
    <label class="relative group">
      <span class="sr-only">{input.value}</span>
      <input
        type="radio"
        value={input.value}
        class="peer sr-only"
        checked={component.control.value === input.value}
        onChange={(e): void => {
          component.control.patchValue(e.currentTarget.value, true)
        }}
      />
      <div
        title={input.value}
        class="p-2 flex justify-center items-center text-center peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
        aria-hidden="true"
      >
        {props.children}
      </div>
    </label>
  )
}

export default RadioButton
