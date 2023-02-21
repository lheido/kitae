/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentData, ThemeEntries } from '@kitae/shared/types'
import Accordion from '@renderer/components/Accordion'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo, For, JSX, Show, untrack } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import './helpers/update-config-properties'

type ComponentColorsFormState = Record<string, string>

interface ComponentColorsPropertyProps {
  labelClass?: string
  prefix: 'backgroundColor' | 'color'
  opened?: boolean
  maxHeight?: number
}

const ComponentColorsProperty: Component<ComponentColorsPropertyProps> = (
  props: ComponentColorsPropertyProps
) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentColorsFormState>()
  const [dataState, setDataState] = createStore<{ colors: ThemeEntries; opened }>({
    colors: {},
    opened: untrack(() => props.opened ?? false)
  })
  const data = createMemo(() => walker(state.data, state.current) as ComponentData)
  const dataTheme = createMemo(() => data().config?.theme)
  const colorsRange = createMemo(() => {
    return [
      { name: 'None', value: undefined },
      ...Object.keys(dataState.colors).map((name) => ({
        name,
        value:
          state.data?.theme.extends?.[dataTheme()]?.colors?.[name] ??
          state.data?.theme?.colors[name]
      }))
    ]
  })
  const getSelectedColorValue = createMemo(
    () =>
      state.data?.theme.extends?.[data().config?.theme]?.colors?.[form[props.prefix]] ??
      state.data?.theme?.colors[form[props.prefix]] ??
      'transparent'
  )
  createEffect(() => {
    setDataState('colors', state.data?.theme.colors ?? {})
  })
  createEffect(() => {
    setForm({
      [props.prefix]: data().config?.[props.prefix] ?? undefined
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(
      JSON.stringify((walker(state.data, path) as ComponentData).config?.[props.prefix] ?? {})
    )
    makeChange({
      path,
      changes: [{ [props.prefix]: previous }, { [props.prefix]: data }],
      handler: DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY
    })
  }, 250)
  const onSubmit = (form: ComponentColorsFormState): void => {
    // setDataState('opened', false)
    updateHandler.clear()
    updateHandler(form[props.prefix] !== 'None' ? form[props.prefix] : undefined)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <Accordion
        accordionId="workspace-themes"
        opened={dataState.opened}
        label={props.prefix === 'backgroundColor' ? 'Background color' : 'Color'}
        icon={props.prefix === 'backgroundColor' ? 'bg-color' : 'text-color'}
        maxHeight={props.maxHeight ?? 320}
        minHeight={130}
        class="bg-base-200 rounded-lg"
        headerSlot={
          <Show when={form[props.prefix] && form[props.prefix] !== 'None'}>
            <div class="absolute top-1/2 z-10 -translate-y-1/2 right-8 flex items-center gap-2">
              <div class="flex items-center">
                <span
                  class="w-5 h-5 rounded-full border border-base-300"
                  style={{
                    background: getSelectedColorValue()
                  }}
                  title={form[props.prefix]}
                />
              </div>
            </div>
          </Show>
        }
      >
        <fieldset class="flex flex-col gap-2">
          <legend class="sr-only">Color options</legend>
          <For each={colorsRange()}>
            {(color): JSX.Element => (
              <div
                class="border rounded-xl border-transparent focus-within:border-base-300"
                classList={{ '!border-secondary': form[props.prefix] === color.name }}
              >
                <input
                  type="radio"
                  id={`${props.prefix}-${color.name}`}
                  class="sr-only"
                  name={props.prefix}
                  value={color.name}
                  //@ts-ignore - solid directives
                  use:field
                />
                <label
                  for={`${props.prefix}-${color.name}`}
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    class="w-6 h-6 rounded-full border border-base-300"
                    style={{ background: color.value }}
                  />
                  <span>{color.name}</span>
                </label>
              </div>
            )}
          </For>
        </fieldset>
      </Accordion>
    </FormProvider>
  )
}

export default ComponentColorsProperty