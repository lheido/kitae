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

interface FlexValue {
  justify: 'start' | 'center' | 'end'
  align: 'start' | 'center' | 'end'
}

interface FlexFormState {
  [key: string]: string
}

type FlexConfig = FlexValue & { direction: 'row' | 'column' } & { wrap: 'nowrap' | 'wrap' }

type FlexDataFunc = (cdir: string) => { [k: string]: boolean | undefined }

interface FlexData {
  value: string
  icon: string
  classList?: FlexDataFunc
}

const direction: FlexData[] = [
  { value: 'row', icon: 'flex-direction' },
  { value: 'row-reverse', icon: 'flex-direction' },
  { value: 'column', icon: 'flex-direction' },
  { value: 'column-reverse', icon: 'flex-direction' }
]

const wrap: FlexData[] = [
  { value: 'nowrap', icon: 'flex-nowrap' },
  { value: 'wrap', icon: 'flex-wrap' }
]

const align: FlexData[] = [
  {
    value: 'start',
    icon: 'align-start',
    classList: (cdir) => ({
      'rotate-180': ['row', 'row-reverse'].includes(cdir),
      'rotate-90': ['column', 'column-reverse'].includes(cdir)
    })
  },
  {
    value: 'center',
    icon: 'align-center',
    classList: (cdir) => ({ 'rotate-90': ['row', 'row-reverse'].includes(cdir) })
  },
  {
    value: 'end',
    icon: 'align-start',
    classList: (cdir) => ({ '-rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'stretch',
    icon: 'align-stretch',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  }
]

const justify: FlexData[] = [
  {
    value: 'start',
    icon: 'justify-start',
    classList: (cdir) => ({
      'rotate-90': ['column'].includes(cdir),
      '-rotate-90': ['column-reverse'].includes(cdir),
      'rotate-180': ['row-reverse'].includes(cdir)
    })
  },
  {
    value: 'center',
    icon: 'justify-center',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'end',
    icon: 'justify-start',
    classList: (cdir) => ({
      'rotate-180': ['row', 'reverse'].includes(cdir),
      '-rotate-90': ['column'].includes(cdir),
      'rotate-90': ['column-reverse'].includes(cdir)
    })
  },
  {
    value: 'between',
    icon: 'justify-between',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'around',
    icon: 'justify-around',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  },
  {
    value: 'evenly',
    icon: 'justify-evenly',
    classList: (cdir) => ({ 'rotate-90': ['column', 'column-reverse'].includes(cdir) })
  }
]

const ComponentFlexProperty: Component<ComponentFlexPropertyProps> = (
  props: ComponentFlexPropertyProps
) => {
  const [state] = useDesignerState()
  const {
    form,
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<FlexFormState>()
  const flexAlignName = crypto.randomUUID()
  const flexJustifyName = crypto.randomUUID()
  const flexDirectionName = crypto.randomUUID()
  const flexWrapName = crypto.randomUUID()
  const path = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  const config = createMemo(() => walker(state.data, path()) as ComponentConfig)
  createEffect(() => {
    const c = config()?.data as FlexConfig
    setForm({
      [flexDirectionName]: c ? c.direction : '',
      [flexAlignName]: c ? c.align : '',
      [flexJustifyName]: c ? c.justify : '',
      [flexWrapName]: c ? c.wrap : ''
    })
  })
  const currentDirection = createMemo(() => form[flexDirectionName])
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
          align: form[flexAlignName],
          justify: form[flexJustifyName],
          direction: form[flexDirectionName],
          wrap: form[flexWrapName]
        } as FlexConfig
      ]
    })
  }
  return (
    <FormProvider onSubmit={onSubmit}>
      <ComponentProperty label="Flex layout" index={props.index} path={props.path}>
        {(): JSX.Element => (
          <div class="px-4 pb-2 flex flex-col gap-1">
            <section class="flex gap-2 items-center">
              <h1 class="basis-16 opacity-70">Direction</h1>
              <fieldset class="flex">
                <legend class="sr-only">Direction group</legend>
                <div class="bg-base-300 w-fit grid grid-cols-4 rounded overflow-hidden">
                  <For each={direction}>
                    {(data): JSX.Element => (
                      <label class="relative group">
                        <span class="sr-only">{data.value}</span>
                        <input
                          type="radio"
                          name={flexDirectionName}
                          class="peer sr-only"
                          value={data.value}
                          // @ts-ignore - solid directive
                          use:field
                        />
                        <div
                          title={data.value}
                          class="p-2 peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
                        >
                          <Icon
                            icon={data.icon}
                            class="w-4 h-4"
                            classList={{
                              '-rotate-90': data.value === 'row',
                              '-rotate-180': data.value === 'column-reverse',
                              'rotate-90': data.value === 'row-reverse'
                            }}
                          />
                        </div>
                      </label>
                    )}
                  </For>
                </div>
              </fieldset>
              <fieldset class="flex">
                <legend class="sr-only">Wrap group</legend>
                <div class="bg-base-300 grid grid-cols-2 rounded overflow-hidden">
                  <For each={wrap}>
                    {(data): JSX.Element => (
                      <label class="relative group">
                        <span class="sr-only">{data.value}</span>
                        <input
                          type="radio"
                          name={flexWrapName}
                          class="peer sr-only"
                          value={data.value}
                          // @ts-ignore - solid directive
                          use:field
                        />
                        <div
                          title={data.value}
                          class="p-2 peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
                        >
                          <Icon
                            icon={data.icon}
                            class="w-4 h-4 m-auto transition-transform"
                            classList={data.classList ? data.classList(currentDirection()) : {}}
                          />
                        </div>
                      </label>
                    )}
                  </For>
                </div>
              </fieldset>
            </section>
            <section class="flex gap-2 items-center">
              <h1 class="basis-16 opacity-70">Align</h1>
              <fieldset class="flex flex-1">
                <legend class="sr-only">Align group</legend>
                <div class="bg-base-300 flex-1 grid grid-cols-4 rounded overflow-hidden">
                  <For each={align}>
                    {(data): JSX.Element => (
                      <label class="relative group">
                        <span class="sr-only">{data.value}</span>
                        <input
                          type="radio"
                          name={flexAlignName}
                          class="peer sr-only"
                          value={data.value}
                          // @ts-ignore - solid directive
                          use:field
                        />
                        <div
                          title={data.value}
                          class="p-2 peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
                        >
                          <Icon
                            icon={data.icon}
                            class="w-4 h-4 m-auto transition-transform"
                            classList={data.classList ? data.classList(currentDirection()) : {}}
                          />
                        </div>
                      </label>
                    )}
                  </For>
                </div>
              </fieldset>
            </section>
            <section class="flex gap-2 items-center">
              <h1 class="basis-16 opacity-70">Justify</h1>
              <fieldset class="flex flex-1">
                <legend class="sr-only">Justify group</legend>
                <div class="bg-base-300 flex-1 grid grid-cols-3 rounded overflow-hidden">
                  <For each={justify}>
                    {(data): JSX.Element => (
                      <label class="relative group">
                        <span class="sr-only">{data.value}</span>
                        <input
                          type="radio"
                          name={flexJustifyName}
                          class="peer sr-only"
                          value={data.value}
                          // @ts-ignore - solid directive
                          use:field
                        />
                        <div
                          title={data.value}
                          class="p-2 peer-checked:bg-secondary hover:bg-secondary hover:bg-opacity-50 transition-all"
                        >
                          <Icon
                            icon={data.icon}
                            class="w-4 h-4 m-auto transition-transform"
                            classList={data.classList ? data.classList(currentDirection()) : {}}
                          />
                        </div>
                      </label>
                    )}
                  </For>
                </div>
              </fieldset>
            </section>
          </div>
        )}
      </ComponentProperty>
    </FormProvider>
  )
}

export default ComponentFlexProperty
