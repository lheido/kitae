import { ComponentData } from '@kitae/shared/types'
import { Component, Match, Switch } from 'solid-js'
import { useDesignerState } from '../../designer.state'
import ButtonForm from './component-forms/ButtonForm'
import ContainerForm from './component-forms/ContainerForm'
import TextForm from './component-forms/TextForm'

const ViewsRightPanel: Component = () => {
  const [, { getCurrentData }] = useDesignerState()
  const type = (): string => (getCurrentData() as ComponentData)?.type ?? ''
  return (
    <Switch>
      <Match when={type() === 'container'}>
        <ContainerForm />
      </Match>
      <Match when={type() === 'text'}>
        <TextForm />
      </Match>
      <Match when={type() === 'button'}>
        <ButtonForm />
      </Match>
    </Switch>
  )
}

export default ViewsRightPanel
