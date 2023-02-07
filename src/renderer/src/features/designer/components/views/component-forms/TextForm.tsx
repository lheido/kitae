import { ComponentData } from '@kitae/shared/types'
import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { useDesignerState } from '@renderer/features/designer/designer.state'
import { DesignerHistoryHandlers } from '@renderer/features/designer/types'
import { walker } from '@renderer/features/designer/utils'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import { Component, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

const TextForm: Component = () => {
  const [state, { getCurrentData }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const [form, setForm] = createStore({ text: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  const updateHandler = debounce((data: ComponentData) => {
    const path = JSON.parse(JSON.stringify(state.current))
    const previous = JSON.parse(JSON.stringify(walker(state.data, path))) as ComponentData
    makeChange({
      path,
      changes: [previous, data],
      handler: DesignerHistoryHandlers.UPDATE_TEXT_COMPONENT_DATA
    })
  }, 250)
  createEffect(() => {
    const data = getCurrentData() as ComponentData
    setForm({ text: data?.config?.text ?? '' })
    setShouldSubmit(false)
  })
  createEffect(() => {
    if (shouldSubmit()) {
      updateHandler.clear()
      updateHandler(JSON.parse(JSON.stringify({ config: { text: form.text } })))
    }
  })
  return (
    <div class="px-2 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Icon icon="components" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Component</h1>
      </div>
      <FormField label="Text">
        <textarea
          name="text"
          id="component-text-form-textarea"
          cols="30"
          rows="1"
          value={form.text}
          onInput={(e): void => {
            setForm('text', e.currentTarget.value)
            setShouldSubmit(true)
          }}
        />
      </FormField>
    </div>
  )
}

export default TextForm
