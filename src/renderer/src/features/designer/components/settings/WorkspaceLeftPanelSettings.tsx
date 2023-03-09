import { Component } from 'solid-js'
import Accordion from '../../../../components/Accordion'

const WorkspaceLeftPanelSettings: Component = () => {
  return (
    <>
      <h1 class="sr-only">Workspace settings</h1>
      <Accordion
        accordionId="basic-settings"
        opened={true}
        label="Basic settings"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
      </Accordion>
      <Accordion
        accordionId="advanced-settings"
        opened={true}
        label="Advanced settings"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas consequuntur corrupti
          placeat voluptate. Reprehenderit tempora commodi ipsum! Quae magni architecto obcaecati
          quos! Eveniet a aspernatur quam molestiae fugit quos!
        </p>
      </Accordion>
    </>
  )
}

export default WorkspaceLeftPanelSettings
