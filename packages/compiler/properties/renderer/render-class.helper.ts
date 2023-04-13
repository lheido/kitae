export const _renderClass = (
  name: string,
  value: string,
  acc: Record<string, string>,
  filters: string[] | false
): void => {
  if (filters && !filters.includes(name)) return
  acc[name] = value
}
