import { Component, ComponentProps, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

interface ToastProps extends ComponentProps<'div'> {
  type: 'error'
}

const typeMap: Record<string, string> = {
  error: 'bg-error text-error-content'
}

const Toast: Component<ToastProps> = (props: ToastProps) => {
  const [classes, component, container] = splitProps(props, ['class'], ['type', 'children'])
  return (
    <div {...container} class={twMerge('p-4 rounded-lg', typeMap[component.type], classes.class)}>
      {component.children}
    </div>
  )
}

export default Toast
