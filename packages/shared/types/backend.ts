import { z } from 'zod'
import { WorkspaceDataSchema } from './workspace-data'

export const BaseBackendSettingsSchema = z.object({
  data: WorkspaceDataSchema
})

export type BaseBackendSettings = z.infer<typeof BaseBackendSettingsSchema>

export const LocalBackendSettingsSchema = BaseBackendSettingsSchema.extend({
  name: z.literal('local'),
  workspaceId: z.string(),
  dataPath: z.string(),
  path: z.string()
})

export type LocalBackendSettings = z.infer<typeof LocalBackendSettingsSchema>

export const SshBackendSettingsSchema = BaseBackendSettingsSchema.extend({
  name: z.literal('ssh'),
  workspaceId: z.string(),
  user: z.string(),
  destination: z.string()
})

export type SshBackendSettings = z.infer<typeof SshBackendSettingsSchema>

export const BackendSettingsSchema = z.union([LocalBackendSettingsSchema, SshBackendSettingsSchema])

export type BackendSettings = z.infer<typeof BackendSettingsSchema>
