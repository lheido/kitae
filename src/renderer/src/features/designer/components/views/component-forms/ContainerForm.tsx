import { ComponentData, ThemeEntry } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { useDesignerState } from '@renderer/features/designer/designer.state'
import { DesignerHistoryHandlers } from '@renderer/features/designer/types'
import { walker } from '@renderer/features/designer/utils'
import { createForm } from '@renderer/features/form'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, createEffect, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'

interface ContainerFormState {
  name: string
  'border-radius-top-left': number
  'border-radius-top-right': number
  'border-radius-bottom-left': number
  'border-radius-bottom-right': number
  'padding-left': number
  'padding-right': number
  'padding-top': number
  'padding-bottom': number
}

interface ContainerDataState {
  spacing: ThemeEntry[]
  rounded: ThemeEntry[]
  sameRadius: boolean
  samePadding: boolean
}

const getIndex = (range: ThemeEntry[], spacingName?: string): number => {
  const index = range.findIndex((s) => s.name === spacingName)
  return index === -1 ? 0 : index
}

const ContainerForm: Component = () => {
  const [state, { getCurrentData }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const {
    setForm,
    FormProvider,
    //@ts-ignore - solid directives
    field
  } = createForm<ContainerFormState>()
  const [dataState, setDataState] = createStore<ContainerDataState>({
    spacing: [],
    rounded: [],
    samePadding: false,
    sameRadius: false
  })
  const spacingRange = createMemo(() => {
    return dataState.spacing.map((s) => s.name)
  })
  const roundedRange = createMemo(() => {
    return dataState.rounded.map((s) => s.name)
  })
  createEffect(() => {
    setDataState('spacing', state.data?.themes[0].spacing ?? [])
  })
  createEffect(() => {
    setDataState('rounded', state.data?.themes[0].rounded ?? [])
  })
  createEffect(() => {
    const data = getCurrentData() as ComponentData
    setForm({
      name: data?.name,
      'border-radius-top-left': getIndex(dataState.rounded, data?.config?.borderRadius?.topLeft),
      'border-radius-top-right': getIndex(dataState.rounded, data?.config?.borderRadius?.topRight),
      'border-radius-bottom-left': getIndex(
        dataState.rounded,
        data?.config?.borderRadius?.bottomLeft
      ),
      'border-radius-bottom-right': getIndex(
        dataState.rounded,
        data?.config?.borderRadius?.bottomRight
      ),
      'padding-left': getIndex(dataState.spacing, data?.config?.padding?.left),
      'padding-right': getIndex(dataState.spacing, data?.config?.padding?.right),
      'padding-top': getIndex(dataState.spacing, data?.config?.padding?.top),
      'padding-bottom': getIndex(dataState.spacing, data?.config?.padding?.bottom)
    })
  })
  const updateHandler = debounce((data: ComponentData) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(JSON.stringify(walker(state.data, path))) as ComponentData
    makeChange({
      path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_CONTAINER_COMPONENT_DATA
    })
  }, 250)
  const onSubmit = (form: ContainerFormState): void => {
    updateHandler.clear()
    updateHandler({
      config: {
        borderRadius: {
          topLeft: dataState.rounded[form['border-radius-top-left']].name,
          topRight: dataState.rounded[form['border-radius-top-right']].name,
          bottomLeft: dataState.rounded[form['border-radius-bottom-left']].name,
          bottomRight: dataState.rounded[form['border-radius-bottom-right']].name
        },
        padding: {
          left: dataState.spacing[form['padding-left']].name,
          right: dataState.spacing[form['padding-right']].name,
          top: dataState.spacing[form['padding-top']].name,
          bottom: dataState.spacing[form['padding-bottom']].name
        }
      }
    } as ComponentData)
  }
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
      class="h-full px-2"
    >
      <FormProvider onSubmit={onSubmit}>
        <div class="flex flex-col gap-2 h-[200vh]">
          <div class="flex items-center gap-2 pb-1 sticky top-0 z-20 bg-base-100">
            <Icon icon="components" />
            <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Component</h1>
          </div>
          <section class="bg-base-200 rounded-lg">
            <header class="px-2 flex items-center">
              <h1 class="flex-1">Corner radius</h1>
              <label>
                <span class="sr-only">Toggle radius</span>
                <input
                  type="checkbox"
                  name="toggle-radius"
                  class="sr-only"
                  checked={dataState.sameRadius}
                  onClick={(e): void => setDataState('sameRadius', e.currentTarget.checked)}
                />
                <div
                  class="p-2 rounded hover:bg-base-300"
                  classList={{ '!bg-secondary !bg-opacity-50': dataState.sameRadius }}
                >
                  <Icon icon="border-radius" class="h-3 w-3" />
                </div>
              </label>
            </header>
            <div class="p-2">
              <FormField
                label={
                  <>
                    <span class="sr-only">Corner radius</span>
                    <Icon icon="border-radius" class="block" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="border-radius"
                  id="component-container-form-border-radius"
                  // @ts-ignore - solid directive
                  use:field={{
                    names: [
                      'border-radius-top-left',
                      'border-radius-top-right',
                      'border-radius-bottom-left',
                      'border-radius-bottom-right'
                    ],
                    range: roundedRange()
                  }}
                  disabled={dataState.sameRadius}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Top left corner</span>
                    <Icon icon="border-radius-top-left" class="block" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="border-radius-top-left"
                  id="component-container-form-border-radius-top-left"
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                  disabled={!dataState.sameRadius}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Top right corner</span>
                    <Icon icon="border-radius-top-right" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="border-radius-top-right"
                  id="component-container-form-border-radius-top-right"
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                  disabled={!dataState.sameRadius}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Bottom left corner</span>
                    <Icon icon="border-radius-bottom-left" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="border-radius-bottom-left"
                  id="component-container-form-border-radius-bottom-left"
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                  disabled={!dataState.sameRadius}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Bottom right corner</span>
                    <Icon icon="border-radius-bottom-right" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="border-radius-bottom-right"
                  id="component-container-form-border-radius-bottom-right"
                  // @ts-ignore - solid directive
                  use:field={{ range: roundedRange() }}
                  disabled={!dataState.sameRadius}
                />
              </FormField>
            </div>
          </section>
          <section class="bg-base-200 rounded-lg">
            <header class="px-2 flex items-center">
              <h1 class="flex-1">Padding</h1>
              <label>
                <span class="sr-only">Toggle padding</span>
                <input
                  type="checkbox"
                  name="toggle-padding"
                  class="sr-only"
                  checked={dataState.samePadding}
                  onClick={(e): void => setDataState('samePadding', e.currentTarget.checked)}
                />
                <div
                  class="p-2 rounded hover:bg-base-300"
                  classList={{ '!bg-secondary !bg-opacity-50': dataState.samePadding }}
                >
                  <Icon icon="border-radius" class="h-3 w-3" />
                </div>
              </label>
            </header>
            <div class="p-2">
              <FormField
                label={
                  <>
                    <span class="sr-only">Padding</span>
                    <Icon icon="border-radius" class="block" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="padding"
                  id="component-container-form-padding"
                  // @ts-ignore - solid directive
                  use:field={{
                    names: ['padding-left', 'padding-top', 'padding-right', 'padding-bottom'],
                    range: spacingRange()
                  }}
                  disabled={dataState.samePadding}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Padding left</span>
                    <Icon icon="border-radius-top-left" class="block" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="padding-left"
                  id="component-container-form-border-padding-left"
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                  disabled={!dataState.samePadding}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Padding top</span>
                    <Icon icon="border-radius-top-right" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="padding-top"
                  id="component-container-form-padding-top"
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                  disabled={!dataState.samePadding}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Padding right</span>
                    <Icon icon="border-radius-bottom-left" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="padding-right"
                  id="component-container-form-padding-right"
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                  disabled={!dataState.samePadding}
                />
              </FormField>
              <FormField
                label={
                  <>
                    <span class="sr-only">Padding bottom</span>
                    <Icon icon="border-radius-bottom-right" />
                  </>
                }
                class="items-center"
                labelClass="basis-0"
              >
                <input
                  type="range"
                  name="padding-bottom"
                  id="component-container-form-padding-bottom"
                  // @ts-ignore - solid directive
                  use:field={{ range: spacingRange() }}
                  disabled={!dataState.samePadding}
                />
              </FormField>
            </div>
          </section>
        </div>
      </FormProvider>
    </OverlayScrollbarsComponent>
  )
}

export default ContainerForm
