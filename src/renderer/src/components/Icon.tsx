import { Component, ComponentProps, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

interface IconProps extends ComponentProps<'svg'> {
  icon: string
}

const Icon: Component<IconProps> = (props: IconProps) => {
  const [component, classes, container] = splitProps(props, ['icon'], ['class'])
  return (
    <svg {...container} class={twMerge('h-6 w-6', classes.class)}>
      <use href={`#symbol-${component.icon}`} />
    </svg>
  )
}

export default Icon
