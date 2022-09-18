export function interpolate(
  offset: number,
  start: number,
  end: number,
  reverse = false
) {
  return reverse
    ? (end - start) * (1 - offset) + start
    : (end - start) * offset + start;
}
