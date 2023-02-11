import { ThemeEntry } from '@kitae/shared/types'
import { ComponentProps } from 'solid-js'

export interface ManagerProps {
  maxHeight?: number
  opened?: boolean
}

export interface AddThemeEntryItemProps extends ComponentProps<'li'> {
  theme: number
  path: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue: () => ThemeEntry
}
