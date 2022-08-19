/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withTranspiled = require('next-transpile-modules')([
  '@vime/core',
  '@vime/react'
])
const { withAxiom } = require('next-axiom')

const sentryWebpackPluginOptions = {
  silent: true
}

const moduleExports = withAxiom(
  withTranspiled(
    withSentryConfig(
      {
        reactStrictMode: process.env.NODE_ENV === 'production',
        trailingSlash: false,
        async rewrites() {
          return [
            {
              source: '/sitemap.xml',
              destination: 'https://assets.lenstube.xyz/sitemaps/sitemap.xml'
            },
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
            },
            {
              source: '/donate',
              destination: 'https://gitcoin.co/grants/6972/lenstube',
              permanent: true
            }
          ]
        }
      },
      sentryWebpackPluginOptions
    )
  )
)

module.exports = moduleExports
