import { Path, ThemeEntry } from '@kitae/shared/types'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { Component, ComponentProps, JSX } from 'solid-js'
import { useDesignerState } from '../../../state/designer.state'
import { samePath } from '../../../utils/same-path.util'
import { DesignerHistoryHandlers } from '../../../utils/types'
import { walker } from '../../../utils/walker.util'

const [state, { navigate, updatePath }] = useDesignerState()

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.DELETE_THEME_ENTRY]: {
    execute: ({ path }): void => {
      updatePath(path, (_, list: ThemeEntry[]) => {
        list.splice(path[path.length - 1] as number, 1)
      })
    },
    undo: ({ path, changes }): void => {
      updatePath(path, (_, list: ThemeEntry[]) => {
        list.splice(path[path.length - 1] as number, 0, changes as ThemeEntry)
      })
    }
  }
})

interface ThemeItemProps extends ComponentProps<'li'> {
  children: JSX.Element
  theme: number
  path: Path
}

const ThemeEntryItem: Component<ThemeItemProps> = (props: ThemeItemProps) => {
  const [, { makeChange }] = useHistory()
  const path = (): Path => ['themes', props.theme, ...props.path]
  const active = (): boolean => samePath(path(), state.current)
  const deleteItem = (): void => {
    const p = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
    const isActive = JSON.parse(JSON.stringify(active()))
    makeChange({
      path: p,
      changes: previous,
      handler: DesignerHistoryHandlers.DELETE_THEME_ENTRY,
      additionalHandler: {
        execute: (): void => {
          if (isActive) {
            navigate(['themes', props.theme])
          }
        }
      }
    })
  }
  return (
    <li class="relative">
      <Button
        class="btn-list-item items-center border border-base-200"
        classList={{ 'border-active': active() }}
        onClick={(): void => {
          navigate(path())
        }}
      >
        {props.children}
      </Button>
      <Button
        class="btn-error btn-icon !p-2 absolute top-1/2 right-1 -translate-y-1/2"
        onClick={(): void => deleteItem()}
      >
        <Icon icon="bin" class="w-4 h-4" />
      </Button>
    </li>
  )
}

export default ThemeEntryItem
