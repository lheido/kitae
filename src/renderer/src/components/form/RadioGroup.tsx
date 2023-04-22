import { Component, ComponentProps, children, createEffect, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

interface RadioGroupProps extends ComponentProps<'fieldset'> {
  label: string
}

const RadioGroup: Component<RadioGroupProps> = (props: RadioGroupProps) => {
  const [component, classes, container] = splitProps(props, ['label'], ['class'])
  const _children = children(() => props.children)
  let containerRef!: HTMLFieldSetElement
  createEffect(() => {
    if (_children() && containerRef) {
      const name = crypto.randomUUID()
      containerRef.querySelectorAll('input').forEach((input) => {
        input.setAttribute('name', name)
      })
    }
  })
  return (
    <fieldset
      ref={containerRef}
      {...container}
      class={twMerge('bg-base-300 rounded overflow-hidden grid', classes.class)}
    >
      <legend class="sr-only">{component.label}</legend>
      {props.children}
    </fieldset>
  )
}

export default RadioGroup
