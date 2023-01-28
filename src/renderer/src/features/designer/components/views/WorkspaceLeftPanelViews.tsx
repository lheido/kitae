import Accordion from '@renderer/components/Accordion'
import { Component } from 'solid-js'

const WorkspaceLeftPanelViews: Component = () => {
  return (
    <>
      <h1 class="sr-only">Workspace Views - left panel</h1>
      <Accordion
        accordionId="workspace-views-pages"
        opened={true}
        label="Pages & components"
        icon="pages"
        basis="40%"
        class="bg-base-200 rounded-lg"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolorem tenetur placeat,
        nesciunt nisi ipsam accusamus quas, tempora repudiandae, consectetur dolorum modi
        exercitationem pariatur voluptas animi deleniti earum numquam optio.
      </Accordion>
      <Accordion
        accordionId="workspace-views-tree"
        opened={true}
        label="Structure"
        icon="structure"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolorem tenetur placeat,
        nesciunt nisi ipsam accusamus quas, tempora repudiandae, consectetur dolorum modi
        exercitationem pariatur voluptas animi deleniti earum numquam optio.
      </Accordion>
    </>
  )
}

export default WorkspaceLeftPanelViews
