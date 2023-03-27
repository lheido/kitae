import { z } from 'zod'

export const WindowSettingsSchema = z.object({
  maximized: z.boolean(),
  height: z.number(),
  width: z.number()
})

export type WindowSettings = z.infer<typeof WindowSettingsSchema>

export const UserSettingsSchema = z.object({
  useCmdUI: z.boolean()
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

export const KitaeSettingsSchema = z.object({
  window: WindowSettingsSchema,
  user: UserSettingsSchema
})

export type KitaeSettings = z.infer<typeof KitaeSettingsSchema>
