import { z } from 'zod'
import { WorkspaceSchema } from './workspace'
import { WorkspaceDataSchema } from './workspace-data'

export const WindowArgumentsKeysSchema = z.union([
  z.literal('title-bar-overlay-height'),
  z.literal('kitae-preview-url')
])

export type WindowArgumentsKeys = z.infer<typeof WindowArgumentsKeysSchema>

export const WindowArgsSchema = z.record(WindowArgumentsKeysSchema, z.string())

export type WindowArgs = z.infer<typeof WindowArgsSchema>

export const UiApiSchema = z.object({
  windowArgs: WindowArgsSchema.optional(),
  getWorkspaces: z
    .function()
    .args()
    .returns(z.promise(z.array(WorkspaceSchema))),
  updateWorkspaces: z
    .function()
    .args(z.array(WorkspaceSchema))
    .returns(z.promise(z.union([z.boolean(), z.instanceof(Error)]))),
  openLocalWorkspace: z
    .function()
    .args()
    .returns(z.promise(z.union([z.tuple([z.string()]), z.boolean(), z.instanceof(Error)]))),
  getWorkspaceData: z
    .function()
    .args(WorkspaceSchema)
    .returns(z.promise(z.union([WorkspaceDataSchema, z.instanceof(Error)]))),
  setWorkspaceData: z
    .function()
    .args(WorkspaceSchema, WorkspaceDataSchema)
    .returns(z.promise(z.union([z.boolean(), z.instanceof(Error)])))
})

export type UiApi = z.infer<typeof UiApiSchema>

export type Path = (string | number)[]
