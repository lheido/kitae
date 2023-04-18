import { ComponentConfig } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import Icon from '@renderer/components/Icon'
import { createForm } from '@renderer/features/form'
import { Component, For, JSX, createEffect, createMemo } from 'solid-js'
import { makeUpdateConfigPropertyChange } from '../../history/property.events'
import { useDesignerState } from '../../state/designer.state'
import ComponentProperty from './helpers/ComponentProperty'
import { PropertyProps } from './types'

interface ComponentFlexPropertyProps extends PropertyProps {
  labelClass?: string
}

interface FlexItemValue {
  quickCombination?: 'expand' | 'auto' | 'initial'
  basis?: string
  grow?: string
  shrink?: string
}

interface FlexFormState {
  [key: string]: string
}

type FlexDataFunc = (cdir?: string) => { [k: string]: boolean | undefined }

interface FlexItemData {
  label: string
  value: string
  icon: string
  classList?: FlexDataFunc
}

const quickFlexCombination: FlexItemData[] = [
  { label: 'Expand', value: 'expand', icon: 'flex-expand' },
  {
    label: 'Auto',
    value: 'auto',
    icon: 'flex-auto'
  },
  { label: 'initial', value: 'initial', icon: 'flex-initial' }
]

type FlexItemConfig = FlexItemValue

const ComponentFlexProperty: Component<ComponentFlexPropertyProps> = (
  props: ComponentFlexPropertyProps
) => {
  const [state] = useDesignerState()
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<FlexFormState>()
  const flexQuickCombinationName = crypto.randomUUID()
  // const flexBasisName = crypto.randomUUID()
  // const flexShrinkName = crypto.randomUUID()
  // const flexGrowName = crypto.randomUUID()
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  createEffect(() => {
    const c = config()?.data as FlexItemConfig
    setForm({
      [flexQuickCombinationName]: c?.quickCombination ?? 'initial'
    })
  })
  const onSubmit = (form: FlexFormState): void => {
    const _path = JSON.parse(JSON.stringify(path()))
    const previous = JSON.parse(
      JSON.stringify((walker(state.data, _path) as ComponentConfig)?.data ?? {})
    )
    makeUpdateConfigPropertyChange({
      path: _path,
      changes: [
        previous,
        {
          quickCombination: form[flexQuickCombinationName]
          // grow: form[flexGrowName],
          // basis: form[flexBasisName],
          // shrink: form[flexShrinkName]
        } as FlexItemConfig
      ]
    })
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <ComponentProperty label="Flex layout" index={props.index} path={props.path}>
        <div class="px-4 pb-2 flex flex-col gap-1">
          <section class="flex gap-2 items-center">
            <h1 class="basis-16 opacity-70">Direction</h1>
            <fieldset class="flex flex-1">
              <legend class="sr-only">Direction group</legend>
              <div class="bg-base-300 flex-1 grid grid-cols-3 rounded overflow-hidden">
                <For each={quickFlexCombination}>
                  {(data): JSX.Element => (
                    <label class="relative group">
                      <span class="sr-only">{data.label}</span>
                      <input
                        type="radio"
                        name={flexQuickCombinationName}
                        class="peer sr-only"
                        value={data.value}
                        // @ts-ignore - solid directive
                        use:field
                      />
                      <div
                        title={data.label}
                        class="p-2 flex justify-center items-center peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
                      >
                        <Icon
                          icon={data.icon}
                          class="w-4 h-4"
                          classList={data.classList ? data.classList() : {}}
                        />
                      </div>
                    </label>
                  )}
                </For>
              </div>
            </fieldset>
          </section>
        </div>
      </ComponentProperty>
    </FormProvider>
  )
}

export default ComponentFlexProperty
