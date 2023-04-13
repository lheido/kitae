import { describe, expect, it } from 'vitest'
import { renderClasses, renderProperties } from '../properties-renderer'
import '../renderer'

describe('properties/renderer/colors', () => {
  describe('renderProperties', () => {
    it('should return object with an empty class property object if no config', () => {
      expect(renderProperties([])).toEqual({ class: {} })
    })

    it('should return an object with the class property if a color config is found', () => {
      expect(
        renderProperties([
          {
            type: 'backgroundColor',
            data: 'primary'
          },
          {
            type: 'color',
            data: 'primary-content'
          }
        ])
      ).toEqual({
        class: {
          'bg-primary': true,
          'text-primary-content': true
        }
      })
    })
  })
  describe('renderClass', () => {
    it('should return an object with the the compiled class name as key and the css as value', () => {
      const result = renderClasses(
        {
          colors: { primary: '#000' },
          fontFamilies: {},
          rounded: {},
          spacing: {}
        },
        false
      )
      expect('bg-primary' in result).toBeTruthy()
      expect(result['bg-primary'] === 'background-color: #000').toBeTruthy()
      expect('text-primary' in result).toBeTruthy()
      expect(result['text-primary'] === 'color: #000').toBeTruthy()
    })
  })
})
