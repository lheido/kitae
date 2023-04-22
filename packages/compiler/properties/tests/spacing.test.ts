import { describe, expect, it } from 'vitest'
import { renderClasses, renderProperties } from '../properties-renderer'
import '../renderer'

describe('properties/renderer/spacing', () => {
  describe('renderProperties', () => {
    it('should return object with an empty class property object if no config', () => {
      expect(renderProperties([])).toEqual({ class: {} })
    })

    it('should return an object with the class property if a color config is found', () => {
      expect(
        renderProperties([
          {
            type: 'padding',
            data: {
              left: '4',
              right: '4',
              top: '4',
              bottom: '4'
            }
          },
          {
            type: 'margin',
            data: {
              left: '4',
              right: '4',
              top: '4',
              bottom: '4'
            }
          }
        ])
      ).toEqual({
        class: {
          'p-4': true,
          'm-4': true
        }
      })
    })
  })
  describe('renderClass', () => {
    it('should return an object with the the compiled class name as key and the css as value', () => {
      const result = renderClasses(
        {
          colors: {},
          fontFamilies: {},
          rounded: {},
          spacing: { 4: '1rem' },
          sizing: {}
        },
        false
      )
      expect('pl-4' in result).toBeTruthy()
      expect(result['pl-4'] === 'padding-left: 1rem').toBeTruthy()
      expect('pr-4' in result).toBeTruthy()
      expect(result['pr-4'] === 'padding-right: 1rem').toBeTruthy()
      expect('pt-4' in result).toBeTruthy()
      expect(result['pt-4'] === 'padding-top: 1rem').toBeTruthy()
      expect('pb-4' in result).toBeTruthy()
      expect(result['pb-4'] === 'padding-bottom: 1rem').toBeTruthy()
      expect('ml-4' in result).toBeTruthy()
      expect(result['ml-4'] === 'margin-left: 1rem').toBeTruthy()
      expect('mr-4' in result).toBeTruthy()
      expect(result['mr-4'] === 'margin-right: 1rem').toBeTruthy()
      expect('mt-4' in result).toBeTruthy()
      expect(result['mt-4'] === 'margin-top: 1rem').toBeTruthy()
      expect('mb-4' in result).toBeTruthy()
      expect(result['mb-4'] === 'margin-bottom: 1rem').toBeTruthy()
    })
  })
})
