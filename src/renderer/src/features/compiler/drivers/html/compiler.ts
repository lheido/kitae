import { ComponentData, WorkspaceData } from '@kitae/shared/types'
import { replaceChildren, replaceSlots } from '@kitae/shared/utils'
import { renderProperties } from '../../../properties'

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
    const style = renderProperties(data)
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
