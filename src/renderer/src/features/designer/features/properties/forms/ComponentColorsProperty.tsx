/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig, ThemeEntries } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import { labelMap } from '@renderer/features/designer/label-map'
import { draggable } from '@renderer/features/drag-n-drop'
import { createForm } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, For, JSX, createEffect, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import { makeUpdateConfigPropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'
import ComponentConfigLabel from './helpers/ComponentConfigLabel'
import ComponentConfigRemove from './helpers/ComponentConfigRemove'
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
  // eslint-disable-next-line solid/reactivity
  const updateHandler = debounce((data: unknown) => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = (walker(state.data, _path) as ComponentConfig).data ?? undefined
    makeUpdateConfigPropertyChange({
      path: _path,
      changes: [previous, data]
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
        <header class="pl-2 py-2 flex items-center">
          <ComponentConfigLabel path={props.path} index={props.index}>
            {labelMap[config().type as string] ?? config().type}
          </ComponentConfigLabel>
          <ComponentConfigRemove path={props.path} />
        </header>
        <fieldset class="group-hover:flex hidden flex-col gap-2 px-1 py-2 absolute top-2 right-10 z-[300] bg-base-200 shadow h-[320px]">
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
