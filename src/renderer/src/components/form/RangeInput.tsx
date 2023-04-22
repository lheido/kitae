import { FormControl } from '@renderer/features/form'
import { Component, ComponentProps, createEffect } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

interface RangeInputProps<T> extends ComponentProps<'div'> {
  control: FormControl<T>
  value?: T
  options: T[]
}

const RangeInput: Component<RangeInputProps<unknown>> = (props: RangeInputProps<unknown>) => {
  const name = crypto.randomUUID()
  const [state, setState] = createStore({ min: 0, max: 0, value: 0 })
  createEffect(() => {
    const options = props.options
    setState(
      produce((s) => {
        s.min = 0
        s.max = options.length - 1
      })
    )
  })
  createEffect(() => {
    const control = props.control
    setState(
      'value',
      props.options.findIndex((option) => option === control.value)
    )
  })
  return (
    <div
      class="relative w-full flex items-center"
      classList={{ 'opacity-50': props.control.disabled }}
    >
      <input
        type="range"
        name={name}
        id={name}
        min={state.min}
        max={state.max}
        value={state.value}
        onInput={(e): void => {
          props.control.patchValue(props.options[e.currentTarget.valueAsNumber], true)
        }}
        class="disabled:pointer-events-none"
        {...{ disabled: props.control.disabled }}
      />
      <p
        class="absolute top-1/2 -translate-y-1/2 bg-secondary bg-opacity-90 text-xs py-px px-3 rounded-lg select-none"
        classList={{
          'left-0': state.value > state.max / 2,
          'right-0': state.value < state.max / 2
        }}
      >
        {props.options[state.value] as string}
      </p>
    </div>
  )
}

export default RangeInput
