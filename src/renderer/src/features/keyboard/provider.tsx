import { ProviderProps } from '@renderer/types'
import { createShortcut } from '@solid-primitives/keyboard'
import { Component, createContext, createEffect } from 'solid-js'
import { shortcuts } from './utils'

export const ShortcutContext = createContext()

export const ShortcutProvider: Component<ProviderProps> = (props: ProviderProps) => {
  createEffect(() => {
    shortcuts.global
      .filter((s) => !s.registered)
      .forEach((shortcut) => {
        createShortcut(shortcut.sequence, shortcut.callback, shortcut.options)
        shortcut.registered = true
      })
  })
  return <ShortcutContext.Provider value={null}>{props.children}</ShortcutContext.Provider>
}
