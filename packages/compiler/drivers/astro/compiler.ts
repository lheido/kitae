import { ComponentData, WorkspaceData } from '@kitae/shared/types'
import { format } from 'prettier'
import { style as htmlStyle } from '../html/compiler'
import { astroRenderers } from './renderers'

export function astro(data: ComponentData, workspace: WorkspaceData, usePrettier = false): string {
  const renderer = astroRenderers[data.type]
  if (renderer) {
    const result = renderer(data, workspace, astro, () => '')
    return usePrettier ? format(result, { parser: 'astro' }) : result
  }
  return ''
}

export function style(workspace: WorkspaceData, useFilters = true, usePrettier = false): string {
  return htmlStyle(workspace, useFilters, usePrettier)
}
