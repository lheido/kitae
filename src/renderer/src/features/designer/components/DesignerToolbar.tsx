import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { isDev } from '@renderer/features/api'
import { useHistory } from '@renderer/features/history'
import { Component, Show } from 'solid-js'
import { useDesignerState } from '../features/state/designer.state'

const DesignerToolbar: Component = () => {
  const [state] = useDesignerState()
  const [, { isRedoable, isUndoable, redo, undo }] = useHistory()

  return (
    <div class="flex-1 flex items-center gap-2">
      <div class="flex items-center">
        <Button
          class="btn-secondary rounded-none h-full px-2 justify-center items-center no-drag"
          disabled={!isUndoable()}
          onClick={(): void => undo.execute()}
          title={`Undo - ${undo.toString()}`}
        >
          <Icon icon="undo" class="w-5 h-5" />
        </Button>
        <Button
          class="btn-secondary rounded-none h-full px-2 justify-center items-center no-drag"
          disabled={!isRedoable()}
          onClick={(): void => redo.execute()}
          title={`Redo - ${redo.toString()}`}
        >
          <Icon icon="redo" class="w-5 h-5" />
        </Button>
      </div>
      <Show when={state.waitForSave}>
        <span>Saving...</span>
      </Show>
      <Show when={isDev()}>
        <span class="opacity-50 w-full flex justify-end">{state.current?.join(', ')}</span>
      </Show>
    </div>
  )
}

export default DesignerToolbar
