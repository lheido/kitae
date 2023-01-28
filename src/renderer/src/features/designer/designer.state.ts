import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'
import WorkspaceLeftPanelSettings from './components/settings/WorkspaceLeftPanelSettings'
import WorkspaceLeftPanelTheme from './components/theme/WorkspaceLeftPanelTheme'
import WorkspaceRightPanelTheme from './components/theme/WorkspaceRightPanelTheme'
import WorkspaceLeftPanelViews from './components/views/WorkspaceLeftPanelViews'

export interface DesignerState {
  current: string
  readonly leftPanel: Component
  readonly rightPanel?: Component
}

export const panels: Record<string, { left: Component; right?: Component }> = {
  settings: {
    left: WorkspaceLeftPanelSettings
  },
  views: {
    left: WorkspaceLeftPanelViews
  },
  theme: {
    left: WorkspaceLeftPanelTheme,
    right: WorkspaceRightPanelTheme
  }
}

export const [designerState, setDesignerState] = createStore<DesignerState>({
  current: 'views',
  get leftPanel(): Component {
    return panels[this.current].left
  },
  get rightPanel(): Component | undefined {
    return panels[this.current].right
  }
})
