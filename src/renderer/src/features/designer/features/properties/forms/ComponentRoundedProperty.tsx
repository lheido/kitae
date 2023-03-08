/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig, ThemeEntries } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { draggable } from '@renderer/features/drag-n-drop'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createMemo, Match, Switch } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../state/designer.state'
import { DesignerHistoryHandlers } from '../../utils/types'
import { walker } from '../../utils/walker.util'
import './helpers/update-config-properties'
import { PropertyProps } from './types'

!!draggable && false

type ComponentRoundedFormState = Record<string, number>

type Edges = 'tl' | 'tr' | 'bl' | 'br' | 'all'

interface ComponentRoundedPropertyProps extends PropertyProps {
  labelClass?: string
}

const ComponentRoundedProperty: Component<ComponentRoundedPropertyProps> = (
  props: ComponentRoundedPropertyProps
) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentRoundedFormState>()
  const names = createMemo(
    (): Record<Edges, string> => ({
      all: `rounded`,
      tl: `rounded-tl`,
      tr: `rounded-tr`,
      bl: `rounded-bl`,
      br: `rounded-br`
    })
  )
  const [dataState, setDataState] = createStore<{ rounded: ThemeEntries; independent: boolean }>({
    rounded: {},
    independent: false
  })
  const roundedRange = createMemo(() => {
    return Object.keys(dataState.rounded).sort((a, b) => {
      return Number(a) - Number(b)
    })
  })
  const findIndex = (value: string): number => {
    const index = roundedRange().findIndex((s) => s === value)
    return index !== -1 ? index : 0
  }
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  createEffect(() => {
    // TODO: merge extends + default
    setDataState('rounded', state.data?.theme.rounded ?? {})
  })
  createEffect(() => {
    const c = config()?.data as Record<Edges, string>
    setForm({
      [names().bl]: findIndex(c?.bl),
      [names().br]: findIndex(c?.br),
      [names().tl]: findIndex(c?.tl),
      [names().tr]: findIndex(c?.tr)
    })
    setDataState('independent', c.bl !== c.br || c.tl !== c.tr)
  })
  // eslint-disable-next-line solid/reactivity
  const updateHandler = debounce((data: unknown) => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(
      JSON.stringify((walker(state.data, _path) as ComponentConfig)?.data ?? {})
    )
    makeChange({
      path: _path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_CONFIG_PROPERTY
    })
  }, 250)
  const onSubmit = (form: ComponentRoundedFormState): void => {
    updateHandler.clear()
    updateHandler({
      tr: roundedRange()[form[names().tr]],
      tl: roundedRange()[form[names().tl]],
      br: roundedRange()[form[names().br]],
      bl: roundedRange()[form[names().bl]]
    })
  }
  const displayLabel = (value: string): string => {
    return value === 'rounded' ? 'rounded' : value?.split('-')[1]
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <section class="bg-base-200 rounded-lg">
        <header class="px-2 flex items-center">
          <h1
            class="flex-1 cursor-move select-none"
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
            Rounded
          </h1>
          <label>
            <span class="sr-only">Independent corner radius</span>
            <input
              type="checkbox"
              name={`toggle-rounded`}
              class="sr-only"
              checked={dataState.independent}
              onClick={(e): void => setDataState('independent', e.currentTarget.checked)}
            />
            <div
              class="p-2 rounded hover:bg-base-300"
              classList={{ '!bg-secondary !bg-opacity-50': dataState.independent }}
            >
              <Icon icon="spacing" class="h-3 w-3" />
            </div>
          </label>
        </header>
        <div class="p-2">
          <Switch>
            <Match when={!dataState.independent}>
              <FormField
                label={
                  <>
                    <span class="sr-only">x</span>
                    <Icon icon="spacing-x" class="w-5 h-5" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().all}
                  id={`component-rounded-form-${names().all}`}
                  // @ts-ignore - solid directive
                  use:field={{
                    names: [names().tr, names().tl, names().br, names().bl],
                    range: roundedRange()
                  }}
                />
                <span class="basis-8 text-center">
                  {displayLabel(roundedRange()[form[names().tl]])}
                </span>
              </FormField>
            </Match>
            <Match when={dataState.independent}>
              <FormField
                label={
                  <>
                    <span class="sr-only">tl</span>
                    <Icon icon="spacing-left" class="w-5 h-5" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().tl}
                  id={`component-rounded-form-${names().tl}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                />
                <span class="basis-8 text-center">
                  {displayLabel(roundedRange()[form[names().tl]])}
                </span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">tr</span>
                    <Icon icon="spacing-right" class="w-5 h-5" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().tr}
                  id={`component-rounded-form-${names().tr}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                />
                <span class="basis-8 text-center">
                  {displayLabel(roundedRange()[form[names().tr]])}
                </span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">bl</span>
                    <Icon icon="spacing-top" class="w-5 h-5" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().bl}
                  id={`component-rounded-form-${names().bl}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                />
                <span class="basis-8 text-center">
                  {displayLabel(roundedRange()[form[names().bl]])}
                </span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">br</span>
                    <Icon icon="spacing-bottom" class="w-5 h-5" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().br}
                  id={`component-rounded-form-${names().br}}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                />
                <span class="basis-8 text-center">
                  {displayLabel(roundedRange()[form[names().br]])}
                </span>
              </FormField>
            </Match>
          </Switch>
        </div>
      </section>
    </FormProvider>
  )
}

export default ComponentRoundedProperty
