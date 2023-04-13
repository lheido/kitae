import { describe, expect, it } from 'vitest'
import { toJsxTagName } from './tag-name.util'

describe('tag-name.util', () => {
  it('should return the correct tag name', () => {
    expect(toJsxTagName('hello-world')).toEqual('HelloWorld')
    expect(toJsxTagName('hello_world')).toEqual('HelloWorld')
    expect(toJsxTagName('hello world')).toEqual('HelloWorld')
    expect(toJsxTagName('Lorem ipsum dolor_sit Amet 42')).toEqual('LoremIpsumDolorSitAmet42')
  })
})
