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

type ComponentSpacingFormState = Record<string, number>

type Edges = 'left' | 'right' | 'top' | 'bottom' | 'x' | 'y'

interface ComponentSpacingPropertyProps extends PropertyProps {
  labelClass?: string
  prefix: 'padding' | 'margin'
}

const ComponentSpacingProperty: Component<ComponentSpacingPropertyProps> = (
  props: ComponentSpacingPropertyProps
) => {
  const [state] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ComponentSpacingFormState>()
  const names = createMemo(
    (): Record<Edges, string> => ({
      x: `${props.prefix}-x`,
      y: `${props.prefix}-y`,
      left: `${props.prefix}-left`,
      right: `${props.prefix}-right`,
      top: `${props.prefix}-top`,
      bottom: `${props.prefix}-bottom`
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
    const c = config()?.data as { left: string; right: string; top: string; bottom: string }
    setForm({
      [names().left]: findIndex(c?.left),
      [names().right]: findIndex(c?.right),
      [names().top]: findIndex(c?.top),
      [names().bottom]: findIndex(c?.bottom)
    })
    setDataState('independent', c.left !== c.right || c.top !== c.bottom)
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
  const onSubmit = (form: ComponentSpacingFormState): void => {
    updateHandler.clear()
    updateHandler({
      left: spacingRange()[form[names().left]],
      right: spacingRange()[form[names().right]],
      top: spacingRange()[form[names().top]],
      bottom: spacingRange()[form[names().bottom]]
    })
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
            {props.prefix === 'padding' ? 'Padding' : 'Margin'}
          </h1>
          <label>
            <span class="sr-only">
              {props.prefix === 'padding' ? 'Independent paddings' : 'Independent margins'}
            </span>
            <input
              type="checkbox"
              name={`toggle-${props.prefix}`}
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
                    <Icon icon="spacing-y" class="w-5 h-5 rotate-90" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().x}
                  id={`component-spacing-form-${names().x}`}
                  // @ts-ignore - solid directive
                  use:field={{
                    names: [names().left, names().right],
                    range: spacingRange()
                  }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().left]]}</span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">y</span>
                    <Icon icon="spacing-y" class="w-5 h-5" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().y}
                  id={`component-spacing-form-${names().y}`}
                  // @ts-ignore - solid directive
                  use:field={{
                    names: [names().top, names().bottom],
                    range: spacingRange()
                  }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().top]]}</span>
              </FormField>
            </Match>
            <Match when={dataState.independent}>
              <FormField
                label={
                  <>
                    <span class="sr-only">left</span>
                    <Icon icon="spacing-top" class="w-5 h-5 -rotate-90" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().left}
                  id={`component-spacing-form-${names().left}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().left]]}</span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">right</span>
                    <Icon icon="spacing-top" class="w-5 h-5 rotate-90" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().right}
                  id={`component-spacing-form-${names().right}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().right]]}</span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">top</span>
                    <Icon icon="spacing-top" class="w-5 h-5" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().top}
                  id={`component-spacing-form-${names().top}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().top]]}</span>
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">bottom</span>
                    <Icon icon="spacing-top" class="w-5 h-5 rotate-180" />
                  </>
                }
                class="items-center pl-1"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name={names().bottom}
                  id={`component-spacing-form-${names().bottom}}`}
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                />
                <span class="basis-8 text-center">{spacingRange()[form[names().bottom]]}</span>
              </FormField>
            </Match>
          </Switch>
        </div>
      </section>
    </FormProvider>
  )
}

export default ComponentSpacingProperty
