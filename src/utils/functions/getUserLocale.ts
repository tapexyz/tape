import logger from '@lib/logger'

const getUserLocale = () => {
  const locale =
    navigator.languages && navigator.languages?.length
      ? navigator.languages[0]
      : navigator.language
  logger.log('[LOG => USER LOCALE]', locale)
  return 'en'
}

export default getUserLocale
