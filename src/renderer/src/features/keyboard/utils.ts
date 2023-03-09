import { KbdKey, ModifierKey } from '@solid-primitives/keyboard'
import { createStore, produce } from 'solid-js/store'

export enum ModifierKeyLabels {
  Control = 'Ctrl',
  Alt = 'Alt',
  Shift = 'Shift',
  Meta = 'Meta'
}

export const ModifierKeyMap: Record<ModifierKey, ModifierKeyLabels> = {
  Alt: ModifierKeyLabels.Alt,
  Control: ModifierKeyLabels.Control,
  Meta: ModifierKeyLabels.Meta,
  Shift: ModifierKeyLabels.Shift
}

export interface ShortcutsState {
  global: Shortcut[]
}

export const [shortcuts, setShortcuts] = createStore<ShortcutsState>({ global: [] })

export const registerGlobalShortcut = (...shortcuts: Shortcut[]): void => {
  setShortcuts(
    produce((s) => {
      shortcuts
        .filter((s) => s.global)
        .forEach((shortcut) => {
          const sequence = shortcut.toString()
          if (!s.global.find((s) => s.toString() === sequence)) {
            s.global.push(shortcut)
          }
        })
    })
  )
}

export class Shortcut {
  public registered = false

  constructor(
    public readonly sequence: KbdKey[],
    public readonly callback: VoidFunction,
    public readonly options?: { preventDefault?: boolean; requireReset?: boolean },
    public readonly global = true
  ) {}

  execute(): void {
    this.callback()
  }

  toString(): string {
    return this.sequence.map((key) => (ModifierKeyMap[key] ? ModifierKeyMap[key] : key)).join(' + ')
  }
}
