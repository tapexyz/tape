const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching
  },
  reactStrictMode: process.env.NODE_ENV === 'production'
})

const sentryWebpackPluginOptions = {
  silent: true
}
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
