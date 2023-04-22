import { SetStoreFunction, createStore, produce } from 'solid-js/store'

export type ValidationError = Record<string, string> | undefined

export interface ControlValue<V> {
  value: V
  disabled?: boolean
  validators?: ((value: V) => ValidationError)[]
}

export type FormControlState<V> = ControlValue<V> & {
  initial: V
  touched: boolean
  disabled: boolean
  errors?: ValidationError
}

export type SetFormControl<V> = (value: V, fromUserInput?: boolean) => void

export type FormControl<V> = {
  get value(): V
  get disabled(): boolean
  get touched(): boolean
  get errors(): ValidationError
  get valid(): boolean
  patchValue(value: V, fromUserInput: boolean): void
  setDisabled(disabled: boolean): void
  set: SetStoreFunction<FormControlState<V>>
}

export interface FormState<T, V> {
  controls: Record<keyof T, FormControl<V>>
  readonly value: Record<keyof T, V>
  readonly touched: boolean
  readonly valid: boolean
}

export type FormControls<T> = Record<string, FormControl<T> | ControlValue<T>>

export const createFormControl = <V, T extends ControlValue<V>>(
  initialValues: T
): FormControl<V> => {
  const validators = initialValues.validators ?? []
  const [control, setControl] = createStore<FormControlState<V>>({
    value: initialValues.value,
    disabled: initialValues.disabled ?? false,
    initial: initialValues.value,
    touched: false,
    get errors() {
      const errors = validators.reduce((acc, validator) => {
        return { ...acc, ...validator(this.value) }
      }, {})
      return Object.keys(errors).length > 0 ? errors : undefined
    }
  })
  return {
    get value(): V {
      return control.value
    },
    get disabled(): boolean {
      return control.disabled
    },
    get touched(): boolean {
      return control.touched
    },
    get errors(): ValidationError {
      return control.errors
    },
    get valid(): boolean {
      return control.errors === undefined
    },
    patchValue(value: V, fromUserInput): void {
      setControl(
        produce((s) => {
          if (!s.touched && fromUserInput) {
            s.touched = true
          }
          s.value = value
        })
      )
    },
    setDisabled(disabled: boolean): void {
      setControl('disabled', disabled)
    },
    set: setControl
  }
}

export const createForm = <V, T extends FormControls<V>>(
  controls: T
): [get: FormState<T, V>, set: SetStoreFunction<FormState<T, V>>] => {
  const [form, setForm] = createStore<FormState<T, V>>({
    controls: Object.entries(controls).reduce(
      (acc, [key, control]) => ({
        ...acc,
        [key]: Array.isArray(control) ? control : createFormControl(control)
      }),
      {}
    ) as Record<keyof T, FormControl<V>>,
    get value() {
      return Object.entries<FormControl<V>>(this.controls).reduce(
        (acc, [key, data]) => ({ ...acc, [key]: data.value }),
        {}
      ) as Record<keyof T, V>
    },
    get touched() {
      return Object.values<FormControl<V>>(this.controls).some((control) => control.touched)
    },
    get valid() {
      return Object.values<FormControl<V>>(this.controls).every((control) => control.valid)
    }
  })
  return [form, setForm]
}
