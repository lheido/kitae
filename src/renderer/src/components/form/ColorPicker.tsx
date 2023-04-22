/* eslint-disable @typescript-eslint/no-namespace */
import { FormControl } from '@renderer/features/form'
import Color from 'color'
import { Component, ComponentProps, createMemo, onMount } from 'solid-js'
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
  control: FormControl<unknown>
}

const ColorPicker: Component<ColorPickerProps> = (props: ColorPickerProps) => {
  let colorPickerRef: HexColorPicker | undefined
  const color = createMemo(() => {
    let color = Color('#000')
    try {
      color = Color((props.control.value as string) ?? '#000')
    } catch (error) {
      /* empty */
    }
    return color
  })
  onMount(() => {
    colorPickerRef?.addEventListener('color-changed', (event) => {
      props.control.patchValue(event.detail.value, true)
    })
  })
  return (
    <div class="flex flex-col gap-4">
      <hex-color-picker ref={colorPickerRef} class="h-72 w-72" color={color().hex()} />
    </div>
  )
}

export default ColorPicker
