import { Path, ThemeData, ThemeEntry } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import Button from '@renderer/components/Button'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
import { Component, ComponentProps, createMemo, For, JSX, Show, splitProps } from 'solid-js'
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers } from '../../types'
import { samePath, walker } from '../../utils'

interface ThemeItemProps extends ComponentProps<'li'> {
  children: JSX.Element
  theme: number
  path: Path
}

const ThemeEntryItem: Component<ThemeItemProps> = (props: ThemeItemProps) => {
  const [state, { navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const path = (): Path => ['themes', props.theme, ...props.path]
  const active = (): boolean => samePath(path(), state.current)
  const deleteItem = (): void => {
    const p = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
    const isActive = JSON.parse(JSON.stringify(active()))
    makeChange({
      path: p,
      type: 'remove',
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

interface ThemeDataItemProps extends ComponentProps<'button'> {
  theme: ThemeData
  active: boolean
}

const ThemeDataItem: Component<ThemeDataItemProps> = (props: ThemeDataItemProps) => {
  const [component, button] = splitProps(props, ['theme', 'active'])
  const [state, { navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const deleteTheme = (): void => {
    const p = JSON.parse(
      JSON.stringify(['themes', state.data!.themes.findIndex((t) => t.id === component.theme.id)])
    )
    const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
    const isActive = JSON.parse(JSON.stringify(component.active))
    const newIndex = Math.max(Math.min(p[1] - 1, state.data!.themes.length - 1), 0)
    makeChange({
      path: p,
      type: 'remove',
      changes: previous,
      handler: DesignerHistoryHandlers.DELETE_THEME_DATA,
      additionalHandler: {
        execute: (): void => {
          if (isActive) {
            navigate(['themes', newIndex])
          }
        },
        undo: (): void => {
          if (isActive) {
            navigate(['themes', p[1]])
          }
        }
      }
    })
  }
  return (
    <li class="relative">
      <Button class="btn-list-item" classList={{ active: component.active }} {...button}>
        {component.theme.name}
      </Button>
      <Show when={state.data!.themes.length > 1}>
        <Button
          class="btn-error btn-icon !p-2 absolute top-1/2 right-1 -translate-y-1/2"
          // TODO: Why eslint solid/reactivity warning here ? It doesn't throw a warning in the ThemeEntryItem component...
          // eslint-disable-next-line solid/reactivity
          onClick={(): void => {
            deleteTheme()
          }}
        >
          <Icon icon="bin" class="w-4 h-4" />
        </Button>
      </Show>
    </li>
  )
}

interface AddThemeEntryItemProps extends ComponentProps<'li'> {
  theme: number
}

const AddColorThemeEntryItem: Component<AddThemeEntryItemProps> = (
  props: AddThemeEntryItemProps
) => {
  const [state, { navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const path = createMemo((): Path => ['themes', props.theme, 'colors'])
  return (
    <li>
      <Button
        class="btn-list-item items-center pl-4 border border-base-200"
        // eslint-disable-next-line solid/reactivity
        onClick={(): void => {
          const p = JSON.parse(JSON.stringify(path()))
          const changes = {
            name: 'new-color',
            value: '#828282'
          }
          makeChange({
            path: p,
            type: 'add',
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
        }}
      >
        <Icon icon="add" />
        <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">Add a new color</span>
      </Button>
    </li>
  )
}

const AddFontFamilyThemeEntryItem: Component<AddThemeEntryItemProps> = (
  props: AddThemeEntryItemProps
) => {
  const [state, { navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const path = createMemo((): Path => ['themes', props.theme, 'fonts', 'family'])
  return (
    <li>
      <Button
        class="btn-list-item items-center pl-4 border border-base-200"
        // eslint-disable-next-line solid/reactivity
        onClick={(): void => {
          const p = JSON.parse(JSON.stringify(path()))
          const changes = {
            name: 'new-font-family',
            value: 'sans-serif'
          }
          makeChange({
            path: p,
            type: 'add',
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
        }}
      >
        <Icon icon="add" />
        <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">
          Add a new font family
        </span>
      </Button>
    </li>
  )
}

const ThemeLeftPanel: Component = () => {
  const [state, { navigate }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const selectedThemeIndex = createMemo((): number => (state.current[1] as number) ?? 0)
  const selectedTheme = createMemo((): ThemeData => {
    const theme = state.data!.themes[selectedThemeIndex()]
    if (!theme) {
      throw `Theme not found: ${JSON.stringify(state.current)}`
    }
    return theme
  })
  const selectedThemeName = createMemo((): string => selectedTheme().name)
  return (
    <>
      <h1 class="sr-only">Workspace Theme - left panel</h1>
      <Accordion
        accordionId="workspace-themes"
        opened={true}
        label="Themes"
        icon="theme"
        basis="50%"
        class="bg-base-200 rounded-lg"
        headerSlot={
          <Show when={selectedThemeName()}>
            <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
              <p class="text-xs px-2 py-0.5 rounded bg-primary bg-opacity-20 select-none">
                {selectedThemeName()}
              </p>
            </div>
          </Show>
        }
      >
        <ul class="flex flex-col">
          <For each={state.data!.themes}>
            {(theme): JSX.Element => (
              <ThemeDataItem
                theme={theme}
                active={theme.id === selectedTheme().id}
                onClick={(): void => {
                  navigate(['themes', state.data!.themes.findIndex((t) => t.id === theme.id)])
                }}
              />
            )}
          </For>
          <li>
            <Button
              class="btn-list-item items-center pl-4 border border-base-200"
              onClick={(): void => {
                const changes = {
                  id: crypto.randomUUID(),
                  name: `new-theme`,
                  colors: [],
                  fonts: {
                    family: []
                  }
                }
                makeChange({
                  path: ['themes'],
                  type: 'add',
                  changes,
                  handler: DesignerHistoryHandlers.ADD_THEME_DATA,
                  additionalHandler: {
                    execute: (): void => {
                      navigate(['themes', state.data!.themes.length - 1])
                    },
                    undo: (): void => {
                      navigate(['themes', state.data!.themes.length - 1])
                    }
                  }
                })
              }}
            >
              <Icon icon="add" />
              <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">
                Add a new theme
              </span>
            </Button>
          </li>
        </ul>
      </Accordion>
      <Accordion
        accordionId="workspace-colors"
        opened={true}
        label="Colors"
        icon="edit-color"
        basis="200%"
        class="bg-base-200 rounded-lg max-w-xs"
      >
        <Show when={selectedTheme()} fallback={<p>No theme selected</p>}>
          <ul class="flex flex-col gap-0">
            <For each={selectedTheme().colors}>
              {(color, i): JSX.Element => (
                <ThemeEntryItem theme={selectedThemeIndex()} path={['colors', i()]}>
                  <span
                    class="w-8 h-8 rounded-full border border-base-300"
                    style={{ 'background-color': color.value }}
                  />
                  <span
                    class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden"
                    title={color.name}
                  >
                    {color.name}
                  </span>
                </ThemeEntryItem>
              )}
            </For>
            <AddColorThemeEntryItem theme={selectedThemeIndex()} />
          </ul>
        </Show>
      </Accordion>
      <Accordion
        accordionId="workspace-font"
        opened={true}
        label="Fonts"
        icon="font-family"
        basis="100%"
        class="bg-base-200 rounded-lg"
      >
        <Show when={selectedTheme()} fallback={<p>No theme selected</p>}>
          <ul class="flex flex-col gap-2">
            <For each={selectedTheme().fonts.family}>
              {(family, i): JSX.Element => (
                <ThemeEntryItem theme={selectedThemeIndex()} path={['fonts', 'family', i()]}>
                  <span
                    class="flex-1 text-2xl leading-none text-ellipsis whitespace-nowrap overflow-hidden"
                    style={{ 'font-family': family.value }}
                  >
                    {family.name}
                  </span>
                </ThemeEntryItem>
              )}
            </For>
            <AddFontFamilyThemeEntryItem theme={selectedThemeIndex()} />
          </ul>
        </Show>
      </Accordion>
    </>
  )
}

export default ThemeLeftPanel
