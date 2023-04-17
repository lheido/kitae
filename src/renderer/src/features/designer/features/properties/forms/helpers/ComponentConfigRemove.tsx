import { ComponentConfig, Path } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { Component, ComponentProps, Show, createMemo } from 'solid-js'
import { makeRemoveConfigChange } from '../../../history/property.events'
import { useDesignerState } from '../../../state/designer.state'

interface ComponentConfigRemoveProps extends ComponentProps<'button'> {
  index?: number
  path?: Path
}

const ComponentConfigRemove: Component<ComponentConfigRemoveProps> = (
  props: ComponentConfigRemoveProps
) => {
  const [state] = useDesignerState()
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const removeConfig = (): void => {
    const _path = JSON.parse(JSON.stringify(path()))
    const config = JSON.parse(JSON.stringify(walker(state.data, _path) as ComponentConfig))
    makeRemoveConfigChange({
      path: _path,
      changes: config
    })
  }
  const removable = createMemo(() => path().includes('config'))
  return (
    <Show when={removable()}>
      <Button class="px-2" onClick={removeConfig} title="Remove this property">
        <Icon icon="bin" class="w-3 h-3" />
      </Button>
    </Show>
  )
}

export default ComponentConfigRemove
