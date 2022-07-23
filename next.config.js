const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { withSentryConfig } = require('@sentry/nextjs')
const withTranspiled = require('next-transpile-modules')(['plyr-react'])

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching
  },
  reactStrictMode: process.env.NODE_ENV === 'production',
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/sitemaps/:match*',
        destination: 'https://assets.lenstube.xyz/sitemaps/:match*'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.com/invite/eVwVdZ3WM9',
        permanent: true
      }
    ]
  }
})

const sentryWebpackPluginOptions = {
  silent: true
}
module.exports = withTranspiled(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions)
)
