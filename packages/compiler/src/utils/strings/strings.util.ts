const separators = /[_.\- ]/;

/**
 * Convert a string to a react component ready name.
 */
export function toReactComponentName(input: string): string {
  let transformedInput = input.trim();
  if (transformedInput.length === 0) {
    return "";
  }
  transformedInput = transformedInput
    .split(separators)
    .map((word) => {
      const w = word.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");
  return transformedInput;
}
