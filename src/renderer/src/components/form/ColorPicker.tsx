/* eslint-disable @typescript-eslint/no-namespace */
import Color from 'color'
import { Component, ComponentProps, createEffect, createSignal, onMount } from 'solid-js'
import 'vanilla-colorful'
import { HexColorPicker } from 'vanilla-colorful'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['hex-color-picker']: any
    }
  }
}

interface ColorPickerProps extends ComponentProps<'div'> {
  color: string
  onColorChanged: (color: string) => void
}

const ColorPicker: Component<ColorPickerProps> = (props: ColorPickerProps) => {
  let colorPickerRef: HexColorPicker | undefined
  const [color, setColor] = createSignal(Color())
  const hex = (): string => color().hex()
  const [shouldEmit, setShouldEmit] = createSignal(false)
  onMount(() => {
    colorPickerRef?.addEventListener('color-changed', (event) => {
      setColor(Color(event.detail.value))
      setShouldEmit(true)
    })
  })
  createEffect(() => {
    setColor(Color(props.color))
    setShouldEmit(false)
  })
  createEffect(() => {
    if (shouldEmit() && props.onColorChanged) {
      props.onColorChanged(hex())
    }
  })
  return (
    <div class="flex flex-col gap-4">
      <hex-color-picker ref={colorPickerRef} class="h-72 w-72" color={hex()} />
    </div>
  )
}

export default ColorPicker
