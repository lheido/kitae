import Icon from '@renderer/components/Icon'
import { Component } from 'solid-js'
import ThemeValueProperty from '../../properties/forms/ThemeValueProperty'

const ThemeFontFamilyForm: Component = () => {
  return (
    <div class="px-2 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Icon icon="font-family" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Font Family</h1>
      </div>
      <ThemeValueProperty label="Families" />
    </div>
  )
}

export default ThemeFontFamilyForm
