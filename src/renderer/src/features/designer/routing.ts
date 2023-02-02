import { Component } from 'solid-js'
import ColorForm from './components/theme/ColorForm'
import FontFamilyForm from './components/theme/FontFamilyForm'
import ThemeForm from './components/theme/ThemeForm'
import ThemeLeftPanel from './components/theme/ThemeLeftPanel'
import ViewsLeftPanel from './components/views/ViewsLeftPanel'
import ViewsRightPanel from './components/views/ViewsRightPanel'

export interface Route {
  path: string
  left?: Component
  right?: Component
}

export type Routes = Route[]

export const routes: Routes = [
  {
    path: 'themes',
    left: ThemeLeftPanel
  },
  {
    path: 'pages',
    left: ViewsLeftPanel,
    right: ViewsRightPanel
  },
  {
    path: 'components',
    left: ViewsLeftPanel,
    right: ViewsRightPanel
  },
  {
    path: 'themes/$',
    right: ThemeForm
  },
  {
    path: 'themes/$/colors/$',
    right: ColorForm
  },
  {
    path: 'themes/$/fonts/family/$',
    right: FontFamilyForm
  }
]
