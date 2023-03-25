import { Component, ComponentProps, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

type BadgeProps = ComponentProps<'p'>

const Badge: Component<BadgeProps> = (props: BadgeProps) => {
  const [component, classes, container] = splitProps(props, ['children'], ['class'])
  return (
    <p
      class={twMerge(
        'text-xs px-2 py-0.5 rounded bg-primary bg-opacity-20 select-none',
        'text-ellipsis whitespace-nowrap overflow-hidden',
        classes.class
      )}
      {...container}
    >
      {component.children}
    </p>
  )
}

export default Badge
