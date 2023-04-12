import {
  expectedCssClasses,
  expectedFirstPageHTML,
  mockWorkspaceData,
  mockWorkspaceDataWithPage
} from '@kitae/shared/test'
import { ComponentData } from '@kitae/shared/types'
import prettier from 'prettier'
import { describe, expect, it } from 'vitest'
import { html, style } from './compiler'

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
    const compiledHtml = html(data, mockWorkspaceData)
    expect(compiledHtml).toBe('<div></div>')
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
    const compiledHtml = html(data, mockWorkspaceData)
    expect(compiledHtml).toBe('<div><p></p></div>')
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
    const compiledHtml = html(data, mockWorkspaceData)
    expect(compiledHtml).toBe('<div class="bg-primary text-primary-content"></div>')
  })

  it('should compile the mocked page to html', () => {
    const compiledHtml = html(mockWorkspaceDataWithPage.pages[0], mockWorkspaceDataWithPage)
    expect(compiledHtml).toBe(expectedFirstPageHTML)
  })

  it('should compile the mocked page and use prettier to format the result', () => {
    const compiledHtml = html(mockWorkspaceDataWithPage.pages[0], mockWorkspaceDataWithPage, true)
    expect(compiledHtml).toBe(prettier.format(expectedFirstPageHTML, { parser: 'html' }))
  })
})

describe('compiler/drivers/html/style', () => {
  it('should return the css classes as a string according to the workspace', () => {
    const renderedStyle = style(mockWorkspaceDataWithPage, true)
    expect(renderedStyle).toBe(expectedCssClasses)
  })

  it('should return the css classes as a string according to the workspace and use prettier to format the result', () => {
    const renderedStyle = style(mockWorkspaceDataWithPage, true, true)
    expect(renderedStyle).toBe(prettier.format(expectedCssClasses, { parser: 'css' }))
  })
})
