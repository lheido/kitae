import { ComponentConfig, ComponentData, WorkspaceData } from '@kitae/shared/types'
import { walkComponentData } from '@kitae/shared/utils'
import prettier from 'prettier'
import { renderClasses, renderProperties } from '../../properties'
import { htmlRenderer } from './components'

/**
 * Compile a kitae component into a html entity
 */
export function html(data: ComponentData, workspace: WorkspaceData, usePrettier = false): string {
  const renderer = htmlRenderer[data.type]
  if (renderer) {
    const result = renderer(data, workspace, html, style)
    return usePrettier ? prettier.format(result, { parser: 'html' }) : result
  }
  return ''
}

export function style(workspace: WorkspaceData, useFilters = true, usePrettier = false): string {
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
  const result = Object.entries(cssClasses)
    .reduce((acc, [key, value]) => {
      acc.push(` .${key} {${value}}`)
      return acc
    }, [] as string[])
    .join('')
    .trim()
  return usePrettier ? prettier.format(result, { parser: 'css' }) : result
}
