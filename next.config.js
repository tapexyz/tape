/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withTranspiled = require('next-transpile-modules')(['plyr-react'])

const sentryWebpackPluginOptions = {
  silent: true
}

const moduleExports = withTranspiled(
  withSentryConfig(
    {
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
    },
    sentryWebpackPluginOptions
  )
)

module.exports = moduleExports
