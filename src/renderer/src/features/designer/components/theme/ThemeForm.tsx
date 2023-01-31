import { ThemeData } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers, ThemeFormData } from '../../types'
import { walker } from '../../utils'

const ThemeForm: Component = () => {
  const [state, { getCurrentData }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const [form, setForm] = createStore({ name: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = getCurrentData() as ThemeFormData
    setForm({ name: data?.name })
    setShouldSubmit(false)
  })
  const updateHandler = debounce((data: ThemeFormData) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(JSON.stringify(walker(state.data, path))) as ThemeData
    makeChange({
      path,
      type: 'update',
      changes: [data.name, previous.name],
      handler: DesignerHistoryHandlers.UPDATE_THEME_DATA
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
        <Icon icon="theme" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Theme</h1>
      </div>
      <FormField label="Name">
        <input
          type="text"
          name="name"
          id="theme-name-input"
          value={form.name}
          onInput={(e): void => {
            setForm('name', e.currentTarget.value)
            setShouldSubmit(true)
          }}
        />
      </FormField>
    </div>
  )
}

export default ThemeForm
