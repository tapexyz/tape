import { i18n } from '@lingui/core'
import dayjs from 'dayjs'
import { en, es } from 'make-plural/plurals'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'utils/constants'

i18n.load({
  en: { plurals: en },
  es: { plurals: es }
})

export const setLocale = async (locale: string) => {
  if (!Object.values(SUPPORTED_LOCALES).includes(locale)) {
    locale = DEFAULT_LOCALE
  }
  localStorage.setItem('locale', JSON.stringify(locale))
  const { messages } = await import(`src/locales/${locale}/messages`)
  i18n.load(locale, messages)
  i18n.activate(locale)
  dayjs.locale(locale)
}

export const initLocale = () => {
  const locale = localStorage.getItem('locale')
  setLocale(locale ? JSON.parse(locale) : DEFAULT_LOCALE)
}
