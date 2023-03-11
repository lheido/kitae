import { z } from 'zod'
import { BackendSettingsSchema } from './backend'

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  backends: z.array(BackendSettingsSchema)
})

export type Workspace = z.infer<typeof WorkspaceSchema>
