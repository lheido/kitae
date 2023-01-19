import { RouteDefinition } from './features/router'
import Workspaces from './pages/Workspaces'

export const initialRoute: RouteDefinition = {
  name: 'workspaces',
  component: Workspaces
}

export const routes: RouteDefinition[] = [initialRoute]
