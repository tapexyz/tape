import { i18n } from '@lingui/core'
import dayjs from 'dayjs'
import { en, es, kn, ru, ta, zh } from 'make-plural/plurals'

export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  es: 'Español'
}

i18n.load({
  en: { plurals: en },
  es: { plurals: es },
  ta: { plurals: ta },
  zh: { plurals: zh },
  kn: { plurals: kn },
  ru: { plurals: ru }
})

const DEFAULT_LOCALE = 'en'

export const setLocale = async (locale: string) => {
  if (!SUPPORTED_LOCALES.hasOwnProperty(locale)) {
    locale = DEFAULT_LOCALE
  }
  localStorage.setItem('locale', JSON.stringify(locale))
  const { messages } = await import(`src/locales/${locale}/messages`)
  i18n.load(locale, messages)
  i18n.activate(locale)
  dayjs.locale(locale)
}

export const initLocale = () => {
  let locale = localStorage.getItem('locale')
  setLocale(locale ? JSON.parse(locale) : DEFAULT_LOCALE)
}
