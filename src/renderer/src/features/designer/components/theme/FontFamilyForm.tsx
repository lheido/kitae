import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { ThemeEntry } from 'packages/shared/types'
import { Component, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers } from '../../types'
import { walker } from '../../utils'

const FontFamilyForm: Component = () => {
  const [state, { getCurrentData }] = useDesignerState()
  let valueRef: HTMLInputElement | undefined
  const [, { makeChange }] = useHistory()
  const [form, setForm] = createStore({ name: '', value: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = getCurrentData() as ThemeEntry
    setForm({ name: data?.name, value: data?.value })
    setShouldSubmit(false)
  })
  const updateHandler = debounce((data: ThemeEntry) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(JSON.stringify(walker(state.data, path))) as ThemeEntry
    makeChange({
      path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_THEME_ENTRY
    })
  }, 250)
  createEffect(() => {
    if (shouldSubmit()) {
      updateHandler.clear()
      updateHandler(JSON.parse(JSON.stringify(form)))
    }
  })
  return (
    <div class="px-2 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Icon icon="font-family" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Font Family</h1>
      </div>
      <FormField label="Name">
        <input
          type="text"
          name="name"
          id="theme-font-family-name-input"
          value={form.name}
          onInput={(e): void => {
            setForm('name', e.currentTarget.value)
            setShouldSubmit(true)
          }}
        />
      </FormField>
      <FormField label="Font Family">
        <input
          ref={valueRef}
          type="text"
          name="value"
          id="theme-font-family-value-input"
          value={form.value}
          onInput={(e): void => {
            setForm('value', e.currentTarget.value)
            setShouldSubmit(true)
          }}
        />
      </FormField>
    </div>
  )
}

export default FontFamilyForm
