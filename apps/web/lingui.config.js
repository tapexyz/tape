/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es', 'fr', 'zh'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  orderBy: 'origin',
  format: 'po',
  fallbackLocales: {
    default: 'en'
  },
  formatOptions: {
    origins: true,
    lineNumbers: false
  }
}
