import { ThemeData, ThemeEntry } from '@kitae/shared/types'
import ColorPicker from '@renderer/components/form/ColorPicker'
import FormField from '@renderer/components/form/FormField'
import Toast from '@renderer/components/Toast'
import { debounce } from '@solid-primitives/scheduled'
import Color from 'color'
import { Component, createEffect, createSignal, Match, Show, Switch, useContext } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { WorkspaceDataContext } from '../../contexts/WorkspaceDataProvider'
import { walker } from '../../utils'

const ColorThemeEntryForm: Component = () => {
  let colorPickerRef: HTMLDivElement | undefined
  let valueRef: HTMLInputElement | undefined
  const [workspaceDataStore, , { get, createUpdate, setState }] = useContext(WorkspaceDataContext)
  const [form, setForm] = createStore({ name: '', value: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = get(workspaceDataStore.selectedPath) as ThemeEntry
    setForm({ name: data?.name, value: Color(data?.value).hex() })
    setShouldSubmit(false)
  })
  const updateHandler = debounce((data: ThemeEntry) => {
    const path = JSON.parse(JSON.stringify(workspaceDataStore.selectedPath))
    const previous = JSON.parse(JSON.stringify(get(path))) as ThemeEntry
    createUpdate({
      execute: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeEntry
            if (entry) {
              entry.name = data.name
              entry.value = data.value
            } else {
              console.error('Try to execute update :', path)
            }
          })
        )
      },
      undo: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeEntry
            if (entry) {
              entry.name = previous.name
              entry.value = previous.value
            } else {
              console.error('Try to undo update :', path)
            }
          })
        )
      }
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
      <h1 class="text-lg">Edit Color</h1>
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

const FontFamilyThemeEntryForm: Component = () => {
  let valueRef: HTMLInputElement | undefined
  const [workspaceDataStore, , { get, createUpdate, setState }] = useContext(WorkspaceDataContext)
  const [form, setForm] = createStore({ name: '', value: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = get(workspaceDataStore.selectedPath) as ThemeEntry
    setForm({ name: data?.name, value: data?.value })
    setShouldSubmit(false)
  })
  const updateHandler = debounce((data: ThemeEntry) => {
    const path = JSON.parse(JSON.stringify(workspaceDataStore.selectedPath))
    const previous = JSON.parse(JSON.stringify(get(path))) as ThemeEntry
    createUpdate({
      execute: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeEntry
            if (entry) {
              entry.name = data.name
              entry.value = data.value
            } else {
              console.error('Try to execute update :', path)
            }
          })
        )
      },
      undo: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeEntry
            if (entry) {
              entry.name = previous.name
              entry.value = previous.value
            } else {
              console.error('Try to undo update :', path)
            }
          })
        )
      }
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
      <h1 class="text-lg">Edit Font Family</h1>
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

type ThemeFormData = Pick<ThemeData, 'name'>

const ThemeForm: Component = () => {
  const [workspaceDataStore, , { get, createUpdate, setState }] = useContext(WorkspaceDataContext)
  const [form, setForm] = createStore({ name: '' })
  const [shouldSubmit, setShouldSubmit] = createSignal(false)
  createEffect(() => {
    const data = get(workspaceDataStore.selectedPath) as ThemeFormData
    setForm({ name: data?.name })
    setShouldSubmit(false)
  })
  const updateHandler = debounce((data: ThemeFormData) => {
    const path = JSON.parse(JSON.stringify(workspaceDataStore.selectedPath))
    const previous = JSON.parse(JSON.stringify(get(path))) as ThemeFormData
    createUpdate({
      execute: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeFormData
            if (entry) {
              entry.name = data.name
            } else {
              console.error('Try to execute update :', path)
            }
          })
        )
      },
      undo: (): void => {
        setState(
          produce((s) => {
            const entry = walker(s.data, path) as ThemeFormData
            if (entry) {
              entry.name = previous.name
            } else {
              console.error('Try to undo update :', path)
            }
          })
        )
      }
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
      <h1 class="text-lg">Edit Theme</h1>
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

const WorkspaceRightPanelTheme: Component = () => {
  const [workspaceDataStore] = useContext(WorkspaceDataContext)
  return (
    <>
      <h1 class="sr-only">Workspace Theme - right panel</h1>
      <Switch
        fallback={
          <Show when={workspaceDataStore.selectedPath.length !== 0}>
            <Toast type="error">
              There may be something wrong with the code of the application.
            </Toast>
          </Show>
        }
      >
        <Match
          when={
            workspaceDataStore.selectedPath.length === 2 &&
            workspaceDataStore.selectedPath.includes('themes') &&
            workspaceDataStore.selectedPath[1] !== undefined
          }
        >
          <ThemeForm />
        </Match>
        <Match
          when={['themes', 'colors'].every((p) => workspaceDataStore.selectedPath.includes(p))}
        >
          <ColorThemeEntryForm />
        </Match>
        <Match
          when={['themes', 'fonts', 'family'].every((p) =>
            workspaceDataStore.selectedPath.includes(p)
          )}
        >
          <FontFamilyThemeEntryForm />
        </Match>
      </Switch>
    </>
  )
}

export default WorkspaceRightPanelTheme
