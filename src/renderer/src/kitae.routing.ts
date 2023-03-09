import { RouteDefinition } from './features/router'
import Designer from './pages/Designer'
import Workspaces from './pages/Workspaces'

export const routes: RouteDefinition[] = [
  {
    name: 'workspaces',
    component: Workspaces
  },
  {
    name: 'designer',
    component: Designer
  }
]
