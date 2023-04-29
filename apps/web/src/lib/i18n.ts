import { i18n } from '@lingui/core'
import dayjs from 'dayjs'
import { en, es, fr } from 'make-plural/plurals'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'utils/constants'

export const storeLocale = async (locale: string) => {
  if (!Object.keys(SUPPORTED_LOCALES).includes(locale)) {
    locale = DEFAULT_LOCALE
  }
  localStorage.setItem('locale', JSON.stringify(locale))
  const { messages } = await import(
    `@lingui/loader!../locales/${locale}/messages.po`
  )
  i18n.load(locale, messages)
  i18n.activate(locale)
  dayjs.locale(locale)
}

export const loadLocale = async () => {
  i18n.load({
    en: { plurals: en },
    es: { plurals: es },
    fr: { plurals: fr }
  })
  let locale = localStorage.getItem('locale')
  const selectedLocale = locale ? JSON.parse(locale) : DEFAULT_LOCALE
  storeLocale(selectedLocale)
}
