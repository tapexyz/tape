/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const { withAxiom } = require('next-axiom')

const sentryWebpackPluginOptions = {
  silent: true
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const moduleExports = withBundleAnalyzer(
  withAxiom(
    withSentryConfig(
      {
        sentry: {
          hideSourceMaps: true
        },
        reactStrictMode: process.env.NODE_ENV === 'production',
        experimental: {
          newNextLinkBehavior: true
        },
        async rewrites() {
          return [
            {
              source: '/sitemap.xml',
              destination: 'https://assets.lenstube.xyz/sitemaps/sitemap.xml'
            },
            {
              source: '/sitemaps/:match*',
              destination: 'https://assets.lenstube.xyz/sitemaps/:match*'
            },
            {
              source: '/collect/:match*',
              destination: 'https://api.mixpanel.com/:match*'
            }
          ]
        },
        async redirects() {
          return [
            {
              source: '/discord',
              destination:
                'https://discord.com/servers/lenstube-980882088783913010',
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
