import Color from 'color'
import { ValidationError } from '../form'

export const ValidateColor = (value: unknown): ValidationError => {
  if (!value) return undefined
  try {
    Color(value)
  } catch (error) {
    return { color: 'Invalid color' } satisfies ValidationError
  }
  return undefined
}
