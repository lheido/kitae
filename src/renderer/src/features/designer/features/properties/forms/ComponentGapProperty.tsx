/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentConfig, ThemeEntries } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import Icon from '@renderer/components/Icon'
import FormField from '@renderer/components/form/FormField'
import { draggable } from '@renderer/features/drag-n-drop'
import { createForm } from '@renderer/features/form'
import { debounce } from '@solid-primitives/scheduled'
import { Component, Match, Switch, createEffect, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import { makeUpdateConfigPropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'
import ComponentProperty from './helpers/ComponentProperty'
import { PropertyProps } from './types'

!!draggable && false

type ComponentSpacingFormState = Record<string, number>

type Edges = 'x' | 'y'

interface ComponentGapPropertyProps extends PropertyProps {
  labelClass?: string
}

const ComponentGapProperty: Component<ComponentGapPropertyProps> = (
  props: ComponentGapPropertyProps
) => {
  const [state] = useDesignerState()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentSpacingFormState>()
  const names = createMemo(
    (): Record<Edges, string> => ({
      x: crypto.randomUUID(),
      y: crypto.randomUUID()
    })
  )
  const [dataState, setDataState] = createStore<{ spacing: ThemeEntries; independent: boolean }>({
    spacing: {},
    independent: false
  })
  const spacingRange = createMemo(() => {
    return Object.keys(dataState.spacing).sort((a, b) => {
      return Number(a) - Number(b)
    })
  })
  const findIndex = (value: string): number => {
    const index = spacingRange().findIndex((s) => s === value)
    return index !== -1 ? index : 0
  }
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  createEffect(() => {
    // TODO: merge extends + default
    setDataState('spacing', state.data?.theme.spacing ?? {})
  })
  createEffect(() => {
    const c = config()?.data as { x: string; y: string }
    setForm({
      [names().x]: findIndex(c?.x),
      [names().y]: findIndex(c?.y)
    })
    setDataState('independent', c.x !== c.y)
  })
  // eslint-disable-next-line solid/reactivity
  const updateHandler = debounce((data: unknown) => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(
      JSON.stringify((walker(state.data, _path) as ComponentConfig)?.data ?? {})
    )
    makeUpdateConfigPropertyChange({
      path: _path,
      changes: [previous, data]
    })
  }, 250)
  const onSubmit = (form: ComponentSpacingFormState): void => {
    updateHandler.clear()
    updateHandler({
      x: spacingRange()[form[names().x]],
      y: spacingRange()[form[names().y]]
    })
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <ComponentProperty
        index={props.index}
        path={props.path}
        label="Gap"
        headerSlot={
          <label>
            <span class="sr-only">Independent gaps</span>
            <input
              type="checkbox"
              name={crypto.randomUUID()}
              class="sr-only"
              checked={dataState.independent}
              onClick={(e): void => setDataState('independent', e.currentTarget.checked)}
            />
            <div
              class="p-2 rounded hover:bg-base-300"
              classList={{ '!bg-secondary !bg-opacity-50': dataState.independent }}
            >
              <Icon icon="gap" class="h-3 w-3" />
            </div>
          </label>
        }
      >
        <div class="p-2">
          <Switch>
            <Match when={!dataState.independent}>
              <FormField
                label={
                  <>
                    <span class="sr-only">Gap</span>
                    <Icon icon="gap-x" class="w-5 h-5" />
                  </>
                }
                class="items-center pl-1 pr-0.5"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().x}
                  id={`component-gap-form-${names().x}`}
                  // @ts-ignore - solid directive
                  use:field={{
                    names: [names().x, names().y],
                    range: spacingRange()
                  }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().x]]}</span>
              </FormField>
            </Match>
            <Match when={dataState.independent}>
              <FormField
                label={
                  <>
                    <span class="sr-only">x</span>
                    <Icon icon="gap-x" class="w-5 h-5" />
                  </>
                }
                class="items-center pl-1 pr-0.5"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().x}
                  id={`component-gap-x-form-${names().x}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().x]]}</span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">y</span>
                    <Icon icon="gap-y" class="w-5 h-5" />
                  </>
                }
                class="items-center pl-1 pr-0.5"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().y}
                  id={`component-gap-y-form-${names().y}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().y]]}</span>
              </FormField>
            </Match>
          </Switch>
        </div>
      </ComponentProperty>
    </FormProvider>
  )
}

export default ComponentGapProperty
