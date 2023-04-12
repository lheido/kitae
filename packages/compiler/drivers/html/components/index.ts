import { ComponentData, WorkspaceData } from '@kitae/shared/types'
import { replaceChildren, replaceSlots } from '@kitae/shared/utils'
import { renderProperties } from '../../../properties'

export type rendererFunc = (
  data: ComponentData,
  workspace: WorkspaceData,
  render: (component: ComponentData, workspace: WorkspaceData) => string,
  style: (workspace: WorkspaceData, useFilters: boolean) => string
) => string

export function getAttributes(data: ComponentData): string {
  const style = renderProperties(data.config)
  const attributes = Object.entries(style).reduce((acc, [key, value]) => {
    const concatenedValues = Object.keys(value).join(' ')
    if (concatenedValues) {
      acc.push(` ${key}="${concatenedValues}"`)
    }
    return acc
  }, [] as string[])
  return attributes.join(' ')
}

export const htmlRenderer: Record<string, rendererFunc> = {
  container: (data, workspace, render): string => {
    const semantic = data.config?.find((c) => c.type === 'semantic')
    const tagName = (semantic?.data as string) ?? 'div'
    const attributes = getAttributes(data)
    const children = data.children?.map((c) => render(c, workspace)).join('') ?? ''
    return `<${tagName}${attributes}>${children}</${tagName}>`
  },
  text: (data): string => {
    const semantic = data.config?.find((c) => c.type === 'semantic')
    const tagName = (semantic?.data as string) ?? 'span'
    const attributes = getAttributes(data)
    const children = data.config?.find((c) => c.type === 'text')?.data as string
    return `<${tagName}${attributes}>${children}</${tagName}>`
  },
  custom: (data, workspace, render): string => {
    const component = workspace.components.find((c) => c.id === data.ref) as ComponentData
    if (component) {
      replaceChildren(data, component)
      const tree = replaceSlots(data, component)
      return tree.children?.map((c) => render(c, workspace)).join('') ?? ''
    }
    return ''
  },
  page: (data, workspace, render, style): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${data.name}</title>
          <style>${style(workspace, true)}</style>
        </head>
        <body${getAttributes(data)}>
          ${data.children?.map((c) => render(c, workspace)).join('') ?? ''}
        </body>
      </html>
    `
  }
}
