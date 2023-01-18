/** @type {import('next').NextConfig} */
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }]
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
      },
      { source: '/terms', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ]
  }
}

module.exports = moduleExports
