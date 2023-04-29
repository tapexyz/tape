/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es', 'fr', 'zh'],
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  format: 'po'
}
