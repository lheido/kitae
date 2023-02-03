import { Component } from 'solid-js'
import Renderer from '../../renderer/Renderer'

const Preview: Component = () => {
  return (
    <>
      <header class="py-2 px-3">Preview header</header>
      <div class="bg-base-300 flex-1 rounded-t-lg overflow-hidden">
        <Renderer />
      </div>
    </>
  )
}

export default Preview
