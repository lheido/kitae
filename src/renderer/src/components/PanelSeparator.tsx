import { GestureEvent, Pan, PointerListener } from 'contactjs'
import {
  Component,
  ComponentProps,
  createEffect,
  onMount,
  Show,
  splitProps,
  untrack
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface PanelSeparatorProps extends ComponentProps<'button'> {
  target: string
  valuemin: number
  valuemax: number
  valuenow: number
  debug?: boolean
}

const PanelSeparator: Component<PanelSeparatorProps> = (props: PanelSeparatorProps) => {
  const [component, button] = splitProps(props, [
    'target',
    'valuemin',
    'valuemax',
    'valuenow',
    'debug'
  ])
  const [state, setState] = createStore({
    valuenow: untrack(() => component.valuenow),
    active: false,
    start: 0
  })
  let buttonRef: HTMLButtonElement | undefined
  let targetRef: HTMLElement | null
  let xOffset = 0
  onMount(() => {
    targetRef = document.querySelector<HTMLElement>(`#${component.target}`)
    if (targetRef) {
      const targetRect = targetRef?.getBoundingClientRect()
      xOffset = targetRect.left
      if (buttonRef) {
        new PointerListener(buttonRef, {
          supportedGestures: [Pan]
        })
        buttonRef.addEventListener('panstart', (e) => {
          e.preventDefault()
          setState(
            produce((s) => {
              s.active = true
              s.start = (e as GestureEvent).detail.global.srcEvent.clientX
            })
          )
        })
        buttonRef.addEventListener('panend', (e) => {
          e.preventDefault()
          setState('active', false)
        })
        buttonRef.addEventListener('pan', (e) => {
          e.preventDefault()
          const event = e as GestureEvent
          if (state.active && 'detail' in e) {
            setState(
              'valuenow',
              Math.max(
                Math.min(state.start + event.detail.global.deltaX, component.valuemax + xOffset),
                component.valuemin + xOffset
              )
            )
          }
        })
      }
    }
  })
  createEffect((prev) => {
    if (buttonRef && targetRef) {
      if (prev === undefined) {
        buttonRef.style.left = `${xOffset + state.valuenow}px`
      } else if (prev !== state.valuenow) {
        buttonRef.style.left = `${state.valuenow}px`
        targetRef.style.width = `${state.valuenow - xOffset}px`
      }
    }
    return state.valuenow
  })
  return (
    <button
      ref={buttonRef}
      role="separator"
      {...button}
      aria-controls={component.target}
      aria-valuenow={state.valuenow}
      aria-valuemin={component.valuemin}
      aria-valuemax={component.valuemax}
    >
      <div class="separator-handler">
        <Show when={component.debug && state.active}>
          <span class="absolute top-1/2 -translate-y-1/2 left-4 flex px-2 rounded bg-secondary bg-opacity-50 text-secondary-content">
            {state.valuenow - xOffset}
          </span>
        </Show>
      </div>
      <span class="sr-only">Panel separator</span>
    </button>
  )
}

export default PanelSeparator
