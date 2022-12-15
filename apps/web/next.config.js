/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'utils', 'web-ui'])

const moduleExports = withTM({
  reactStrictMode: process.env.NODE_ENV === 'production',
  experimental: {
    scrollRestoration: true,
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
        destination: 'https://discord.com/servers/lenstube-980882088783913010',
        permanent: true
      },
      {
        source: '/donate',
        destination: 'https://gitcoin.co/grants/6972/lenstube',
        permanent: true
      },
      {
        source: '/terms',
        destination:
          'https://sasicodes.notion.site/Lenstube-Terms-Conditions-8408e6e485a0437d91c4d077695b8eed',
        permanent: true
      },
      {
        source: '/privacy',
        destination:
          'https://sasicodes.notion.site/Lenstube-Privacy-Policy-eb69ee55983a427da5bba44b19da0ded',
        permanent: true
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ]
      }
    ]
  }
})

module.exports = moduleExports
