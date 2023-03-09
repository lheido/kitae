import { Component, ComponentProps, onCleanup, onMount, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import Icon from '../Icon'

interface AddInputProps extends ComponentProps<'label'> {
  placeholder?: string
  pattern?: string
  inputClass?: string
  onEnter?: (value: string) => boolean
}

const AddInput: Component<AddInputProps> = (props: AddInputProps) => {
  let inputRef!: HTMLInputElement
  const [component, classes, handlers, label] = splitProps(
    props,
    ['placeholder', 'pattern'],
    ['class', 'inputClass'],
    ['onEnter']
  )
  const keypressHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      if (handlers.onEnter) {
        if (handlers.onEnter(inputRef.value)) {
          inputRef.value = ''
        }
      }
    }
  }
  onMount(() => {
    inputRef.addEventListener('keypress', keypressHandler)
  })
  onCleanup(() => {
    inputRef.removeEventListener('keypress', keypressHandler)
  })
  return (
    <label {...label} class={twMerge('flex items-center gap-2 relative', classes.class)}>
      <span class="sr-only">{label.children}</span>
      <Icon icon="add" class="absolute top-1/2 left-2 -translate-y-1/2 w-6 h-6" />
      <input
        ref={inputRef}
        type="text"
        class={twMerge('pl-9', classes.inputClass)}
        placeholder={component.placeholder}
        pattern={component.pattern}
      />
    </label>
  )
}

export default AddInput
