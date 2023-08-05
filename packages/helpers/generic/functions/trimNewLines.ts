export const trimNewLines = (text: string) => {
  if (!text) {
    return text
  }
  return text.replaceAll('\n', '')
}
