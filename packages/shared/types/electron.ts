import { z } from 'zod'

export const WindowSettingsSchema = z.object({
  maximized: z.boolean(),
  height: z.number(),
  width: z.number()
})

export type WindowSettings = z.infer<typeof WindowSettingsSchema>

export const KitaeSettingsSchema = z.object({
  window: WindowSettingsSchema
})

export type KitaeSettings = z.infer<typeof KitaeSettingsSchema>
