import { Path } from '@kitae/shared/types'
import Badge from '@renderer/components/Badge'
import Button from '@renderer/components/Button'
import AddInput from '@renderer/components/form/AddInput'
import Icon from '@renderer/components/Icon'
import { Component, createEffect, createMemo, createSignal, For, JSX } from 'solid-js'
import { makeAddThemeEntryChange } from '../../history/theme.events'
import { useDesignerState } from '../../state/designer.state'
import { samePath } from '../../utils/same-path.util'

interface ManagerProps {
  scrollTop: number
  scrollOffset: number
}

const ColorsManager: Component<ManagerProps> = (props: ManagerProps) => {
  const [state, { navigate }] = useDesignerState()
  const isActive = (path: Path): boolean => samePath(state.current, path)
  const path = (color: string): Path =>
    state.theme === 'default'
      ? ['theme', 'colors', color]
      : ['theme', 'extends', state.theme, 'colors', color]
  const rounded = (): number => {
    return 8 - Math.max(0, Math.min(8, (props.scrollTop - props.scrollOffset) * 0.1))
  }
  const badgeOpacity = (): number => {
    return Math.max(0, Math.min(1, (props.scrollTop - props.scrollOffset) * 0.02))
  }
  const colors = createMemo(() => {
    return Object.entries(state.data?.theme?.colors ?? {}).map(([name, value]) => ({
      name,
      value: state.data?.theme?.extends?.[state.theme]?.colors?.[name] ?? value
    }))
  })
  const [pattern, setPattern] = createSignal('[a-zA-Z_-]{1,}')
  createEffect(() => {
    setPattern(
      `((?!${colors()
        .map((t) => `^${t.name}$`)
        .join('|')})^[a-zA-Z0-9_-]+$)`
    )
  })
  const addColor = (name: string): boolean => {
    const path =
      state.theme === 'default' ? ['theme', 'colors'] : ['theme', 'extends', state.theme, 'colors']
    makeAddThemeEntryChange({
      path,
      changes: { name, value: '#000000' },
      afterExecute: (): void => {
        navigate([...path, name])
      },
      afterUndo: (): void => {
        navigate(path)
      }
    })
    return true
  }
  return (
    <section class="relative bg-base-200 rounded-lg">
      <header
        class="px-2 py-1 flex-1 flex gap-2 items-center sticky top-0 z-[201] bg-base-200 rounded-t-lg"
        style={{
          'border-top-left-radius': `${rounded()}px`,
          'border-top-right-radius': `${rounded()}px`
        }}
      >
        <Icon icon="bg-color" class="h-4 w-4 opacity-50" />
        <h1 class="flex-1">Colors</h1>
        <Badge style={{ opacity: badgeOpacity() }}>{state.theme}</Badge>
      </header>
      <ul class="flex flex-col gap-0 p-2">
        <For each={colors()}>
          {(color): JSX.Element => (
            <li class="relative">
              <Button
                class="btn-list-item items-center border border-base-200"
                classList={{ 'border-active': isActive(path(color.name)) }}
                onClick={(): void => {
                  navigate(path(color.name))
                }}
              >
                <span
                  class="w-8 h-8 rounded-full border border-base-300"
                  style={{ 'background-color': color.value }}
                />
                <span class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">
                  {color.name}
                </span>
              </Button>
            </li>
          )}
        </For>
        <li>
          <AddInput
            pattern={pattern()}
            placeholder="Type a name and press enter"
            class="mt-2"
            onEnter={addColor}
          >
            Add a new color
          </AddInput>
        </li>
      </ul>
    </section>
  )
}

export default ColorsManager
