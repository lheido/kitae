const separators = /[_.\- ]/

export function toJsxTagName(name: string): string {
  let transformedName = name.trim()
  if (transformedName.length === 0) {
    return ''
  }
  transformedName = transformedName
    .split(separators)
    .map((word) => {
      const w = word.toLowerCase()
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
    .join('')
  return transformedName
}
