import { describe, expect, it } from 'vitest'
import { renderClasses, renderProperties } from '../properties-renderer'
import '../renderer'

describe('properties/renderer/rounded', () => {
  describe('renderProperties', () => {
    it('should return object with an empty class property object if no config', () => {
      expect(renderProperties([])).toEqual({ class: {} })
    })

    it('should return an object with the class property if a color config is found', () => {
      expect(
        renderProperties([
          {
            type: 'rounded',
            data: {
              tl: 'sm',
              tr: 'sm',
              bl: 'sm',
              br: 'sm'
            }
          }
        ])
      ).toEqual({
        class: {
          'rounded-tl-sm': true,
          'rounded-tr-sm': true,
          'rounded-bl-sm': true,
          'rounded-br-sm': true
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
          rounded: { sm: '0.125rem' },
          spacing: {}
        },
        false
      )
      expect('rounded-tl-sm' in result).toBeTruthy()
      expect(result['rounded-tl-sm'] === 'border-top-left-radius: 0.125rem').toBeTruthy()
      expect('rounded-tr-sm' in result).toBeTruthy()
      expect(result['rounded-tr-sm'] === 'border-top-right-radius: 0.125rem').toBeTruthy()
      expect('rounded-bl-sm' in result).toBeTruthy()
      expect(result['rounded-bl-sm'] === 'border-bottom-left-radius: 0.125rem').toBeTruthy()
      expect('rounded-br-sm' in result).toBeTruthy()
      expect(result['rounded-br-sm'] === 'border-bottom-right-radius: 0.125rem').toBeTruthy()
    })
  })
})
