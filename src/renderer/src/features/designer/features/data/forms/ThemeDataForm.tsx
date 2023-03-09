import Icon from '@renderer/components/Icon'
import { Component } from 'solid-js'
import NameProperty from '../../properties/forms/NameProperty'

const ThemeDataForm: Component = () => {
  return (
    <div class="px-2 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Icon icon="theme" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Theme</h1>
      </div>
      <NameProperty />
    </div>
  )
}

export default ThemeDataForm
