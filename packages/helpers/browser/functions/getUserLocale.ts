export const getUserLocale = () => {
  const locale = navigator?.languages?.length
    ? navigator.languages[0]
    : navigator.language

  return locale || 'en'
}
