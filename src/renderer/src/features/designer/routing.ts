import { Path } from '@kitae/shared/types'
import { Component } from 'solid-js'
import ThemeColorForm from './features/data/forms/ThemeColorForm'
import ThemeFontFamilyForm from './features/data/forms/ThemeFontFamilyForm'
import SettingsLeftPanel from './features/pages/settings/SettingsLeftPanel'
import ThemeLeftPanel from './features/pages/theme/ThemeLeftPanel'
import ViewsLeftPanel from './features/pages/views/ViewsLeftPanel'
import ViewsRightPanel from './features/pages/views/ViewsRightPanel'

export interface Route {
  path: Path
  left?: Component
  right?: Component
}

export type Routes = Route[]

export const routes: Routes = [
  {
    path: ['settings'],
    left: SettingsLeftPanel
  },
  {
    path: ['theme'],
    left: ThemeLeftPanel
  },
  {
    path: ['pages'],
    left: ViewsLeftPanel,
    right: ViewsRightPanel
  },
  {
    path: ['components'],
    left: ViewsLeftPanel,
    right: ViewsRightPanel
  },
  {
    path: ['theme', 'colors', '$'],
    right: ThemeColorForm
  },
  {
    path: ['theme', 'extends', '$', 'colors', '$'],
    right: ThemeColorForm
  },
  {
    path: ['theme', 'fontFamilies', '$'],
    right: ThemeFontFamilyForm
  },
  {
    path: ['theme', 'extends', '$', 'fontFamilies', '$'],
    right: ThemeFontFamilyForm
  }
]
