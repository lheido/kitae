import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  Setter,
  useContext
} from 'solid-js'
import { createStore, produce, SetStoreFunction } from 'solid-js/store'

export interface FormProviderProps {
  children: JSX.Element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (form: any) => void
}

export interface FieldAccessor {
  /**
   * field names to take into account instead of the current one
   */
  names?: string[]
  /**
   * range of values for the range type fields
   */
  range?: string[]
}

export type FormFieldDirective = (elt: HTMLInputElement, accessor: () => FieldAccessor) => void

export const createForm = <T extends object>(
  initialValues?: T
): {
  form: T
  setForm: SetStoreFunction<T>
  FormProvider: Component<FormProviderProps>
  field: FormFieldDirective
  setShouldSubmit: Setter<boolean>
} => {
  const FormContext = createContext<[T, SetStoreFunction<T>, Accessor<boolean>, Setter<boolean>]>([
    {} as T,
    (): void => {},
    (): boolean => false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (): any => {}
  ])
  const [form, setForm] = createStore<T>((initialValues || {}) as T)
  const [shouldSubmit, setShouldSubmit] = createSignal(false, { equals: () => false })
  const FormProvider: Component<FormProviderProps> = (props: FormProviderProps) => {
    createEffect(() => {
      if (shouldSubmit()) {
        props.onSubmit(JSON.parse(JSON.stringify(form)) as T)
        setShouldSubmit(false)
      }
    })
    return (
      <FormContext.Provider value={[form, setForm, shouldSubmit, setShouldSubmit]}>
        {props.children}
      </FormContext.Provider>
    )
  }
  const field = (elt: HTMLInputElement, accessor: () => FieldAccessor): void => {
    const [form, setForm, , setShouldSubmit] = useContext(FormContext)
    createEffect(() => {
      const acc = accessor()
      switch (elt.type) {
        case 'range': {
          elt.min = '0'
          elt.max = acc.range ? `${acc.range.length - 1}` : '0'
          elt.value = form[acc.names ? acc.names[0] : elt.name]
          break
        }
        case 'radio':
        case 'checkbox': {
          const value = form[acc.names ? acc.names[0] : elt.name] || 'None'
          const isChecked = value === 'None' ? elt.value === 'None' : value === elt.value
          elt.checked = isChecked
          break
        }
        default:
          elt.value = form[acc.names ? acc.names[0] : elt.name]
          break
      }
    })
    const onInput = (): void => {
      const acc = accessor()
      const names = acc.names || [elt.name]
      const value = elt.value
      setForm(
        produce((form) => {
          names.forEach((name) => {
            form[name] = value
          })
        })
      )
      setShouldSubmit(true)
    }
    elt.addEventListener('input', onInput)
    onCleanup(() => {
      elt.removeEventListener('input', onInput)
    })
  }
  return { form, setForm, FormProvider, field, setShouldSubmit }
}
