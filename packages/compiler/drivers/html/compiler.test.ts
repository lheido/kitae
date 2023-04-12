import {
  expectedCssClasses,
  expectedFirstPageHTML,
  mockWorkspaceData,
  mockWorkspaceDataWithPage
} from '@kitae/shared/test'
import { ComponentData } from '@kitae/shared/types'
import { describe, expect, it } from 'vitest'
import toHtml, { style } from './compiler'

describe('compiler/drivers/html/to-html', () => {
  it('should compile a kitae component into a html entity', () => {
    const data: ComponentData = {
      type: 'container',
      config: [
        {
          type: 'semantic',
          data: 'div'
        }
      ],
      children: [],
      name: 'test',
      id: '1test'
    }
    const html = toHtml(data, mockWorkspaceData)
    expect(html).toBe('<div></div>')
  })

  it('should compile a kitae component with children into a html entity', () => {
    const data: ComponentData = {
      type: 'container',
      config: [
        {
          type: 'semantic',
          data: 'div'
        }
      ],
      children: [
        {
          type: 'container',
          config: [
            {
              type: 'semantic',
              data: 'p'
            }
          ],
          children: [],
          name: '2test',
          id: '2test'
        }
      ],
      name: '1test',
      id: '1test'
    }
    const html = toHtml(data, mockWorkspaceData)
    expect(html).toBe('<div><p></p></div>')
  })

  it('should compile including css classes', () => {
    const data: ComponentData = {
      type: 'container',
      name: 'fooo',
      id: '1',
      config: [
        {
          type: 'backgroundColor',
          data: 'primary'
        },
        {
          type: 'color',
          data: 'primary-content'
        }
      ]
    }
    const html = toHtml(data, mockWorkspaceData)
    expect(html).toBe('<div class="bg-primary text-primary-content"></div>')
  })

  it('should compile the mocked page to html', () => {
    const html = toHtml(mockWorkspaceDataWithPage.pages[0], mockWorkspaceDataWithPage)
    expect(html).toBe(expectedFirstPageHTML)
  })
})

describe('compiler/drivers/html/style', () => {
  it('should return the css classes as a string according to the workspace', () => {
    const renderedStyle = style(mockWorkspaceDataWithPage)
    expect(renderedStyle).toBe(expectedCssClasses)
  })
})
