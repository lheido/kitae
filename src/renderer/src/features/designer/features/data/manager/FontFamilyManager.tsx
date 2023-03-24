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

const FontFamilyManager: Component<ManagerProps> = (props: ManagerProps) => {
  const [state, { navigate }] = useDesignerState()
  const isActive = (path: Path): boolean => samePath(state.current, path)
  const path = (family: string): Path =>
    state.theme === 'default'
      ? ['theme', 'fontFamilies', family]
      : ['theme', 'extends', state.theme, 'fontFamilies', family]
  const rounded = (): number => {
    return 8 - Math.max(0, Math.min(8, (props.scrollTop - props.scrollOffset) * 0.1))
  }
  const badgeOpacity = (): number => {
    return Math.max(0, Math.min(1, (props.scrollTop - props.scrollOffset) * 0.02))
  }
  const families = createMemo(() =>
    Object.entries(state.data?.theme?.fontFamilies ?? {}).map(([name, value]) => ({
      name,
      value: state.data?.theme?.extends?.[state.theme]?.fontFamilies?.[name] ?? value
    }))
  )
  const [pattern, setPattern] = createSignal('[a-zA-Z_-]{1,}')
  createEffect(() => {
    setPattern(
      `((?!${families()
        .map((t) => `^${t.name}$`)
        .join('|')})^[a-zA-Z0-9_-]+$)`
    )
  })
  const addFontFamily = (name: string): boolean => {
    const path =
      state.theme === 'default'
        ? ['theme', 'fontFamilies']
        : ['theme', 'extends', state.theme, 'fontFamilies']
    makeAddThemeEntryChange({
      path,
      changes: { name, value: 'arial' },
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
        <Icon icon="font-family" class="h-4 w-4 opacity-50" />
        <h1 class="flex-1">Font Families</h1>
        <Badge style={{ opacity: badgeOpacity() }}>{state.theme}</Badge>
      </header>
      <ul class="flex flex-col gap-0 p-2">
        <For each={families()}>
          {(family): JSX.Element => (
            <li class="relative">
              <Button
                class="btn-list-item items-center border border-base-200"
                classList={{ 'border-active': isActive(path(family.name)) }}
                onClick={(): void => {
                  navigate(path(family.name))
                }}
              >
                <span
                  class="flex-1 text-ellipsis whitespace-nowrap overflow-hidden"
                  style={{
                    'font-family': family.value
                  }}
                >
                  {family.name}
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
            onEnter={addFontFamily}
          >
            Add a new font family
          </AddInput>
        </li>
      </ul>
    </section>
  )
}

export default FontFamilyManager
