import { ComponentConfig, ComponentData, Path } from '@kitae/shared/types'
import { walker } from '@kitae/shared/utils'
import { FormControls, FormState, createForm } from '@renderer/features/form'
import { HistoryEventChangeWithAdditionalHandler } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Accessor, createEffect, createMemo } from 'solid-js'
import { makeUpdateConfigPropertyChange } from '../../../history/property.events'
import { useDesignerState } from '../../../state/designer.state'
import { PropertyProps } from '../types'

export const useConfigPath = (props: PropertyProps): Accessor<Path> => {
  const [state] = useDesignerState()
  const memo = createMemo(() =>
    props.index ? [...state.current, 'config', props.index] : props.path!
  )
  return memo
}

export const getConfig = (props: PropertyProps): Accessor<ComponentConfig> => {
  const [state] = useDesignerState()
  const path = useConfigPath(props)
  const memo = createMemo(() => walker(state.data, path()) as ComponentConfig)
  return memo
}

export const getSiblingConfigs = (props: PropertyProps): Accessor<ComponentConfig[]> => {
  const [state] = useDesignerState()
  const path = useConfigPath(props)
  const memo = createMemo(() => {
    const currentIndex = path()[path().length - 1]
    const component = walker<ComponentData>(state.data, path().slice(0, -2))
    return component?.config?.filter((_, i) => i !== currentIndex) ?? []
  })
  return memo
}

export const getUpdateData = (props: PropertyProps): [Path, ComponentConfig] => {
  const [state] = useDesignerState()
  const path = useConfigPath(props)
  const p = JSON.parse(JSON.stringify(path()))
  const previous = JSON.parse(
    JSON.stringify((walker(state.data, p) as ComponentConfig)?.data ?? {})
  )
  return [p, previous]
}

export interface ConfigFormOptions {
  init?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitHandler?: (change: Omit<HistoryEventChangeWithAdditionalHandler<any>, 'handler'>) => void
}

export const useConfigForm = <V, T extends FormControls<V>>(
  controls: T,
  props: PropertyProps,
  options?: ConfigFormOptions
): FormState<T, V> => {
  const opts: ConfigFormOptions = {
    init: true,
    submitHandler: makeUpdateConfigPropertyChange,
    ...(options ?? {})
  }
  const config = getConfig(props)
  const [form] = createForm<V, T>(controls)
  createEffect(() => {
    if (opts.init) {
      const configData = config()?.data
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].patchValue(configData?.[key] ?? '', false)
      })
    }
  })
  const updateHandlerRef = debounce((p: Path, previous: unknown, data: unknown) => {
    opts.submitHandler!({
      path: p,
      changes: [previous, data]
    })
  }, 250)
  createEffect((prev: string | undefined) => {
    const value = JSON.stringify(form.value)
    if (prev !== undefined && form.touched && form.valid && prev !== value) {
      updateHandlerRef.clear()
      const [p, previous] = getUpdateData(props)
      updateHandlerRef(p, previous, JSON.parse(value))
    }
    return value
  })
  return form
}
