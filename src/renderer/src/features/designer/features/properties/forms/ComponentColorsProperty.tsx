/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig, ThemeEntries } from '@kitae/shared/types'
import { labelMap } from '@renderer/features/designer/label-map'
import { draggable } from '@renderer/features/drag-n-drop'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createEffect, createMemo, For, JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import './helpers/update-config-properties'
import { PropertyProps } from './types'

!!draggable && false

type ComponentColorsFormState = Record<string, string>

interface ComponentColorsPropertyProps extends PropertyProps {
  labelClass?: string
  prefix: 'backgroundColor' | 'color'
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
    opened: false
  })
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const inputName = createMemo(() => `${path().join('-')}_${props.prefix}`)
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  const dataTheme = createMemo(() => state.theme)
  // const dataTheme = createMemo(() => data().config?.theme)
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
  // const getSelectedColorValue = createMemo(
  //   () =>
  //     state.data?.theme.extends?.[dataTheme()]?.colors?.[form[props.prefix]] ??
  //     state.data?.theme?.colors[form[props.prefix]] ??
  //     'transparent'
  // )
  createEffect(() => {
    setDataState('colors', state.data?.theme.colors ?? {})
  })
  createEffect(() => {
    setForm({
      [inputName()]: (config().data as string) ?? undefined
    })
  })
  const updateHandler = debounce((data: unknown) => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = (walker(state.data, _path) as ComponentConfig).data ?? undefined
    makeChange({
      path: _path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY
    })
  }, 250)
  const onSubmit = (form: ComponentColorsFormState): void => {
    // setDataState('opened', false)
    updateHandler.clear()
    updateHandler(form[inputName()] !== 'None' ? form[inputName()] : undefined)
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="group bg-base-200 rounded-lg relative">
        <header class="px-2 py-2 flex items-center">
          <h1
            class="flex-1 cursor-move select-none capitalize"
            // @ts-ignore - directive
            // eslint-disable-next-line solid/jsx-no-undef
            use:draggable={{
              format: 'kitae/move-config',
              effect: 'move',
              id: crypto.randomUUID(),
              path: path(),
              enabled: true
            }}
          >
            {labelMap[config().type as string] ?? config().type}
          </h1>
        </header>
        <fieldset class="group-hover:flex hidden flex-col gap-2 px-1 py-2 absolute top-2 right-8 z-[300] bg-base-200 shadow h-[320px]">
          <legend class="sr-only">Color options</legend>
          <OverlayScrollbarsComponent
            defer
            options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
            class="h-full px-2"
          >
            <For each={colorsRange()}>
              {(color): JSX.Element => (
                <div
                  class="border rounded-xl border-transparent focus-within:border-base-300"
                  classList={{ '!border-secondary': (form[inputName()] ?? 'None') === color.name }}
                >
                  <input
                    type="radio"
                    id={`${inputName()}-${color.name}`}
                    class="sr-only"
                    name={inputName()}
                    value={color.name}
                    //@ts-ignore - solid directives
                    use:field
                  />
                  <label
                    for={`${inputName()}-${color.name}`}
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
          </OverlayScrollbarsComponent>
        </fieldset>
      </section>
      {/* <Accordion
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
      </Accordion> */}
    </FormProvider>
  )
}

export default ComponentColorsProperty
