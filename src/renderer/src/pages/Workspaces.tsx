import { Component } from 'solid-js'
import { api } from '../features/api'

const Workspaces: Component = () => {
  api.getWorkspaces().then(console.log)
  return (
    <div>
      <h2>workspaces</h2>
    </div>
  )
}

export default Workspaces
