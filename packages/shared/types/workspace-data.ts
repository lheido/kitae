import { z } from 'zod'

export const ThemeEntriesSchema = z.record(z.string())

export type ThemeEntries = z.infer<typeof ThemeEntriesSchema>

export const ThemeExtendsSchema = z.record(ThemeEntriesSchema)

export type ThemeExtends = z.infer<typeof ThemeExtendsSchema>

export const WorkspaceThemeSchema = z.object({
  colors: ThemeEntriesSchema,
  fontFamilies: ThemeEntriesSchema,
  spacing: ThemeEntriesSchema,
  sizing: ThemeEntriesSchema,
  rounded: ThemeEntriesSchema
})

export const ExtendableWorkspaceThemeSchema = WorkspaceThemeSchema.extend({
  extends: ThemeExtendsSchema.optional()
})

export type WorkspaceTheme = z.infer<typeof ExtendableWorkspaceThemeSchema>

export const ComponentConfigSchema = z.object({
  type: z.string(),
  data: z.unknown()
})

export type ComponentConfig = z.infer<typeof ComponentConfigSchema>

export const ComponentDataSchema = z.object({
  id: z.string(),
  ref: z.string().optional(), // ref to the custom component
  name: z.string(),
  type: z.string(), // container | button | etc
  driver: z.string().optional(), // react | astro | solid | etc
  config: z.array(ComponentConfigSchema).optional()
})

export type ComponentData = z.infer<typeof ComponentDataSchema> & {
  children?: ComponentData[]
  slots?: Record<string, ComponentData[]>
}

export const ExtendedComponentDataSchema: z.ZodType<ComponentData> = ComponentDataSchema.extend({
  children: z.lazy(() => ComponentDataSchema.array()),
  slots: z.record(z.lazy(() => ComponentDataSchema.array()))
})

const WorkspaceDriversSchema = z.enum(['astro' /*'solid', 'design-system'*/])

export const WorkspaceDataSchema = z.object({
  components: z.array(ExtendedComponentDataSchema),
  pages: z.array(ExtendedComponentDataSchema),
  theme: ExtendableWorkspaceThemeSchema,
  driver: WorkspaceDriversSchema
})

export type WorkspaceDrivers = z.infer<typeof WorkspaceDriversSchema>

export type WorkspaceData = z.infer<typeof WorkspaceDataSchema>

export const WorkspaceDriverResultSchema = z.object({
  components: z.record(z.string()),
  pages: z.record(z.string())
})

export type WorkspaceDriverResult = z.infer<typeof WorkspaceDriverResultSchema>

export const WorkspaceDriverSchema = z.object({
  compile: z.function().args(WorkspaceDataSchema).returns(z.promise(WorkspaceDriverResultSchema)),
  compileAndWritesFiles: z
    .function()
    .args(z.string(), WorkspaceDataSchema)
    .returns(z.promise(z.boolean())),
  initWorkspace: z.function().args(z.string(), WorkspaceDataSchema).returns(z.promise(z.boolean()))
})

export type WorkspaceDriver = z.infer<typeof WorkspaceDriverSchema>
