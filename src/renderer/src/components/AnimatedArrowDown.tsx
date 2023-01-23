import { Component, ComponentProps, createEffect, createSignal, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

export interface AnimatedArrowDownProps extends ComponentProps<'svg'> {
  state: boolean
}

const AnimatedArrowDown: Component<AnimatedArrowDownProps> = (props: AnimatedArrowDownProps) => {
  const [classes, component, container] = splitProps(props, ['class'], ['state'])
  const [state, setState] = createSignal(false)
  createEffect(() => {
    setState(component.state)
  })
  return (
    <svg
      {...container}
      class={twMerge('h-16 w-16', classes.class)}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        class="fill-current stroke-current"
        stroke-linecap="square"
        stroke-linejoin="miter"
        stroke-miterlimit="10"
        stroke-width="2"
      >
        <g class="js-nc-int-icon nc-int-sorting" classList={{ 'nc-int-icon-state-b': state() }}>
          <line
            class="stroke-current"
            fill="none"
            stroke-linecap="square"
            x1="16"
            x2="5"
            y1="22"
            y2="11"
          />
          <line fill="none" stroke-linecap="square" x1="27" x2="16" y1="11" y2="22" />
        </g>
      </g>
    </svg>
  )
}

export default AnimatedArrowDown
