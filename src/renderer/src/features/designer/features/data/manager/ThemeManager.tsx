// import { ThemeData } from '@kitae/shared/types'
import { ThemeExtends } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Badge from '@renderer/components/Badge'
import Button from '@renderer/components/Button'
import AddInput from '@renderer/components/form/AddInput'
import Icon from '@renderer/components/Icon'
import { registerHistoryChangeHandler, useHistory } from '@renderer/features/history'
import { Component, createEffect, createMemo, createSignal, For, JSX, Show } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { ManagerProps } from './types'

const [state, { navigate, setTheme, updatePath }] = useDesignerState()

interface NewThemeChanges {
  name: string
  value: ThemeExtends
}

registerHistoryChangeHandler({
  [DesignerHistoryHandlers.ADD_THEME]: {
    execute: ({ path, changes }): void => {
      const { name, value } = changes as NewThemeChanges
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        current[name] = value
      })
    },
    undo: ({ path, changes }): void => {
      const { name } = changes as NewThemeChanges
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        delete current[name]
      })
    }
  },
  [DesignerHistoryHandlers.DELETE_THEME]: {
    execute: ({ path, changes }): void => {
      const { name } = changes as NewThemeChanges
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        delete current[name]
      })
    },
    undo: ({ path, changes }): void => {
      const { name, value } = changes as NewThemeChanges
      updatePath(path, (current: Record<string, ThemeExtends>) => {
        current[name] = value
      })
    }
  }
})

const ThemeManager: Component<ManagerProps> = (props: ManagerProps) => {
  const [, { makeChange }] = useHistory()
  const [pattern, setPattern] = createSignal('[a-zA-Z_-]{1,}')
  const themes = createMemo(() => [
    { name: 'default', path: ['theme'] },
    ...Object.keys(state.data!.theme.extends ?? {}).map((name) => ({
      name,
      path: ['theme', 'extends', name]
    }))
  ])
  createEffect(() => {
    setPattern(
      `((?!${themes()
        .map((t) => `^${t.name}$`)
        .join('|')})^[a-zA-Z0-9_-]+$)`
    )
  })
  const addTheme = (name: string): boolean => {
    makeChange({
      path: ['theme', 'extends'],
      changes: {
        name,
        value: {
          colors: {},
          fontFamilies: {},
          rounded: {},
          spacing: {}
        }
      } as NewThemeChanges,
      handler: DesignerHistoryHandlers.ADD_THEME,
      additionalHandler: {
        execute: (): void => {
          setTheme(name)
          navigate(['theme', 'extends', name])
        },
        undo: (): void => {
          setTheme('default')
          navigate(['theme'])
        }
      }
    })
    return true
  }
  const deleteTheme = (theme: string): void => {
    const previous = JSON.parse(JSON.stringify(state.data!.theme.extends![theme]))
    makeChange({
      path: ['theme', 'extends'],
      changes: {
        name: theme,
        value: previous
      },
      handler: DesignerHistoryHandlers.DELETE_THEME,
      additionalHandler: {
        execute: (): void => {
          if (state.theme === theme) {
            setTheme('default')
            navigate(['theme'])
          }
        },
        undo: (): void => {
          if (state.theme === 'default') {
            setTheme(theme)
            navigate(['theme', 'extends', theme])
          }
        }
      }
    })
  }
  return (
    <Accordion
      accordionId="workspace-themes"
      opened={props.opened ?? false}
      label="Themes"
      icon="theme"
      maxHeight={props.maxHeight ?? 320}
      minHeight={82}
      class="bg-base-200 rounded-lg"
      headerSlot={
        <Show when={state.theme}>
          <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
            <Badge>{state.theme}</Badge>
          </div>
        </Show>
      }
    >
      <ul class="flex flex-col">
        <For each={themes()}>
          {(theme): JSX.Element => (
            <li class="relative">
              <Button
                class="btn-list-item"
                classList={{ active: state.theme === theme.name }}
                onClick={(): void => {
                  setTheme(theme.name)
                  navigate(theme.path)
                }}
              >
                {theme.name}
              </Button>
              <Show when={state.data!.theme.extends?.[theme.name]}>
                <Button
                  class="btn-error btn-icon !p-2 absolute top-1/2 right-1 -translate-y-1/2"
                  onClick={(): void => deleteTheme(theme.name)}
                >
                  <Icon icon="bin" class="w-4 h-4" />
                </Button>
              </Show>
            </li>
          )}
        </For>
        <li>
          <AddInput
            pattern={pattern()}
            placeholder="Type a name and press enter"
            class="mt-2"
            onEnter={addTheme}
          >
            Add a new theme
          </AddInput>
        </li>
      </ul>
    </Accordion>
  )
}

export default ThemeManager
