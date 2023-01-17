/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: ['lens', 'utils', 'web-ui'],
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
      },
      {
        source: '/gitcoin',
        destination:
          'https://grant-explorer.gitcoin.co/#/round/1/0xd95a1969c41112cee9a2c931e849bcef36a16f4c/0x0f1d31d427400106f3d2958225dd235ae60b6a7572fb5155201b723e1ae79632-0xd95a1969c41112cee9a2c931e849bcef36a16f4c',
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
}

module.exports = moduleExports
