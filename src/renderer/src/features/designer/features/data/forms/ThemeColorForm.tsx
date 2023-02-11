import Icon from '@renderer/components/Icon'
import { Component } from 'solid-js'
import ThemeColorValueProperty from '../../properties/forms/ThemeColorValueProperty'

const ThemeColorForm: Component = () => {
  return (
    <div class="px-2 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Icon icon="edit-color" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Color</h1>
      </div>
      <ThemeColorValueProperty label="Color" />
    </div>
  )
}

export default ThemeColorForm
