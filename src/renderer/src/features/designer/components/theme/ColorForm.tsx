import { ThemeEntry } from '@kitae/shared/types'
import ColorPicker from '@renderer/components/form/ColorPicker'
import FormField from '@renderer/components/form/FormField'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/features/history'
import { debounce } from '@solid-primitives/scheduled'
import Color from 'color'
import { Component, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDesignerState } from '../../designer.state'
import { DesignerHistoryHandlers } from '../../types'
import { walker } from '../../utils'

const ColorForm: Component = () => {
  let colorPickerRef: HTMLDivElement | undefined
  let valueRef: HTMLInputElement | undefined
  const [state, { getCurrentData }] = useDesignerState()
  const [, { makeChange }] = useHistory()
  const [form, setForm] = createStore({ name: '', value: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = getCurrentData() as ThemeEntry
    setForm({ name: data?.name, value: Color(data?.value).hex() })
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
        <Icon icon="edit-color" />
        <h1 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">Edit Color</h1>
      </div>
      <FormField label="Name">
        <input
          type="text"
          name="name"
          id="theme-color-name-input"
          value={form.name}
          onInput={(e): void => {
            setForm('name', e.currentTarget.value)
            setShouldSubmit(true)
          }}
        />
      </FormField>
      <div class="w-full h-12 rounded" style={{ background: form.value }} />
      <ColorPicker
        ref={colorPickerRef}
        color={form.value}
        onColorChanged={(c): void => {
          setForm('value', c)
          valueRef?.classList.remove('!border-error')
          setShouldSubmit(true)
        }}
      />
      <FormField label="Color">
        <input
          ref={valueRef}
          type="text"
          name="value"
          id="theme-color-value-input"
          value={form.value && Color(form.value).hex()}
          onInput={(e): void => {
            try {
              setForm('value', Color(e.currentTarget.value).hex())
              setShouldSubmit(true)
              valueRef?.classList.remove('!border-error')
            } catch (error) {
              valueRef?.classList.add('!border-error')
            }
          }}
        />
      </FormField>
    </div>
  )
}

export default ColorForm
