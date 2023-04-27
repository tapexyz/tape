import { i18n } from '@lingui/core'
import dayjs from 'dayjs'
import { en, es } from 'make-plural/plurals'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'utils/constants'

export const initLocale = async () => {
  i18n.load({
    en: { plurals: en },
    es: { plurals: es }
  })
  let locale = localStorage.getItem('locale')
  const selectedLocale = locale ? JSON.parse(locale) : DEFAULT_LOCALE

  if (!Object.values(SUPPORTED_LOCALES).includes(selectedLocale)) {
    locale = DEFAULT_LOCALE
  }
  localStorage.setItem('locale', JSON.stringify(locale))
  const { messages } = await import(`src/locales/${locale}/messages`)
  i18n.load(selectedLocale, messages)
  i18n.activate(selectedLocale)
  dayjs.locale(selectedLocale)
}
