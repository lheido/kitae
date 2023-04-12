import { ComponentConfig, ComponentData, WorkspaceData } from '@kitae/shared/types'
import { replaceChildren, replaceSlots, walkComponentData } from '@kitae/shared/utils'
import { renderClasses, renderProperties } from '../../properties'

/**
 * Compile a kitae component into a html entity
 */
export default function toHtml(data: ComponentData, workspace: WorkspaceData): string {
  let tagName: string | undefined
  let children = ''
  switch (data.type) {
    case 'container': {
      const semantic = data.config?.find((c) => c.type === 'semantic')
      tagName = (semantic?.data as string) ?? 'div'
      children = data.children?.map((c) => toHtml(c, workspace)).join('') ?? ''
      break
    }

    case 'text': {
      const semantic = data.config?.find((c) => c.type === 'semantic')
      tagName = (semantic?.data as string) ?? 'span'
      children = data.config?.find((c) => c.type === 'text')?.data as string
      break
    }

    case 'custom': {
      const component = workspace.components.find((c) => c.id === data.ref) as ComponentData
      if (component) {
        replaceChildren(data, component)
        const tree = replaceSlots(data, component)
        children = tree.children?.map((c) => toHtml(c, workspace)).join('') ?? ''
      }
      break
    }
  }
  if (tagName !== undefined) {
    const style = renderProperties(data.config)
    const attributes = Object.entries(style).reduce((acc, [key, value]) => {
      const concatenedValues = Object.keys(value).join(' ')
      if (concatenedValues) {
        acc.push(` ${key}="${concatenedValues}"`)
      }
      return acc
    }, [] as string[])
    return `<${tagName}${attributes.join('')}>${children}</${tagName}>`
  } else {
    return children
  }
}

export function style(workspace: WorkspaceData, useFilters = true): string {
  const configs: ComponentConfig[] = []
  if (useFilters) {
    workspace.components.forEach((component) => {
      walkComponentData(component, (data) => {
        configs.push(...(data.config ?? []))
      })
    })
    workspace.pages.forEach((page) => {
      walkComponentData(page, (data) => {
        configs.push(...(data.config ?? []))
      })
    })
  }
  const cssClasses = renderClasses(
    workspace.theme,
    useFilters && Object.keys(renderProperties(configs).class)
  )
  return Object.entries(cssClasses)
    .reduce((acc, [key, value]) => {
      acc.push(` .${key} {${value}}`)
      return acc
    }, [] as string[])
    .join('')
    .trim()
}
