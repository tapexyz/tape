/** @type {import('next').NextConfig} */
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }]
const moduleExports = {
  transpilePackages: [
    '@lenstube/lens',
    '@lenstube/browser',
    '@lenstube/generic',
    '@lenstube/ui'
  ],
  reactStrictMode: process.env.NODE_ENV === 'production',
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true,
    swcPlugins: [['@lingui/swc-plugin', {}]]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://static.lenstube.xyz/sitemaps/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://static.lenstube.xyz/sitemaps/:match*'
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
        destination: 'https://bounties.gitcoin.co/grants/6972/lenstube',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/1/0x12bb5bbbfe596dbc489d209299b8302c3300fa40/0x12bb5bbbfe596dbc489d209299b8302c3300fa40-10',
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
