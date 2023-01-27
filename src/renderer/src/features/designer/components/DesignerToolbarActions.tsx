import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { Component, useContext } from 'solid-js'
import { WorkspaceDataContext } from '../contexts/WorkspaceDataProvider'

const DesignerToolbarActions: Component = () => {
  const [, , { undo, redo, isUndoable, isRedoable }] = useContext(WorkspaceDataContext)

  return (
    <div class="flex">
      <Button
        class="btn-secondary rounded-none h-full px-2 justify-center items-center no-drag"
        disabled={!isUndoable()}
        onClick={(): void => undo()}
        title={`Undo - ${undo.shortcut
          .map((k) => (k === 'Control' ? 'Ctrl' : k.toUpperCase()))
          .join(' + ')}`}
      >
        <Icon icon="undo" class="w-5 h-5" />
      </Button>
      <Button
        class="btn-secondary rounded-none h-full px-2 justify-center items-center no-drag"
        disabled={!isRedoable()}
        onClick={(): void => redo()}
        title={`Redo - ${redo.shortcut
          .map((k) => (k === 'Control' ? 'Ctrl' : k.toUpperCase()))
          .join(' + ')}`}
      >
        <Icon icon="redo" class="w-5 h-5" />
      </Button>
    </div>
  )
}

export default DesignerToolbarActions
