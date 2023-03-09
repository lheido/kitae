import { Path, ThemeEntry } from '@kitae/shared/types'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { Component, createMemo } from 'solid-js'
import { useDesignerState } from '../../../state/designer.state'
import { DesignerHistoryHandlers } from '../../../utils/types'
import { walker } from '../../../utils/walker.util'
import { AddThemeEntryItemProps } from '../types'

const [state, { navigate, updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.ADD_THEME_ENTRY]: {
    execute: ({ path, changes }): void => {
      updatePath(path, (list: ThemeEntry[]) => {
        list.push(changes as ThemeEntry)
      })
    },
    undo: ({ path }): void => {
      updatePath(path, (list: ThemeEntry[]) => {
        list.pop()
      })
    }
  }
})

const AddThemeEntryItem: Component<AddThemeEntryItemProps> = (props: AddThemeEntryItemProps) => {
  const [, { makeChange }] = useHistory()
  const path = createMemo((): Path => ['themes', props.theme, ...props.path])
  const clickHandler = (): void => {
    const p = JSON.parse(JSON.stringify(path()))
    const changes = props.newValue()
    makeChange({
      path: p,
      changes,
      handler: DesignerHistoryHandlers.ADD_THEME_ENTRY,
      additionalHandler: {
        execute: (): void => {
          navigate([...p, walker<ThemeEntry[]>(state.data, p)!.length - 1])
        },
        undo: (): void => {
          navigate(['themes', props.theme])
        }
      }
    })
  }
  return (
    <li>
      <Button class="btn-list-item items-center pl-4 border border-base-200" onClick={clickHandler}>
        <Icon icon="add" />
        <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">{props.children}</span>
      </Button>
    </li>
  )
}

export default AddThemeEntryItem
