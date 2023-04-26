/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es'],
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  format: 'po'
}
