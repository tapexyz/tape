export const isEmptyString = (text: string | undefined) => {
  return text ? text.trim().length === 0 : true
}
