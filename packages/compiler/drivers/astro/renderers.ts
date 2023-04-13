import { toJsxTagName } from '@kitae/shared/utils'
import { htmlRenderers } from '../html/renderers'
import { RendererFunc } from '../types'

export const astroRenderers: Record<string, RendererFunc> = {
  custom: (data, workspace, render) => {
    const insidePage = !workspace.components.find((c) => c.id === data.id)
    if (insidePage) {
      const tagname = toJsxTagName(data.name)
      if (data.children?.length === 0) {
        return `<${tagname} />`
      }
      return `<${tagname}>${
        data.children?.map((c) => render(c, workspace)).join('') ?? ''
      }</${tagname}>`
    }
    return `
    ---
    // TODO: take into account component inputs and the Props interface.
    ---
    ${data.children?.map((c) => render(c, workspace)).join('') ?? ''}
    `
  },
  container: (data, workspace, render, style) => {
    return htmlRenderers.container(data, workspace, render, style)
  },
  text: (data, workspace, render, style) => {
    return htmlRenderers.text(data, workspace, render, style)
  },
  page: (data, workspace, render) => {
    return `---
import HtmlLayout from '../layouts/HtmlLayout.astro'
---
<HtmlLayout title="${data.name}">
  ${data.children?.map((c) => render(c, workspace)).join('') ?? ''}
</HtmlLayout>
`
  }
}
