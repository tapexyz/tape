/** @type {import('next').NextConfig} */
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }]
const moduleExports = {
  transpilePackages: [
    '@tape.xyz/lens',
    '@tape.xyz/browser',
    '@tape.xyz/generic',
    '@tape.xyz/ui'
  ],
  reactStrictMode: process.env.NODE_ENV === 'production',
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://static.tape.xyz/sitemaps/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://static.tape.xyz/sitemaps/:match*'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/channel/:handle(.+).lens',
        destination: '/channel/:handle',
        permanent: true
      },
      {
        source: '/channel/:handle(.+).test',
        destination: '/channel/:handle',
        permanent: true
      },
      {
        source: '/channel/:handle',
        destination: '/u/:handle',
        permanent: true
      },
      {
        source: '/discord',
        destination:
          'https://discord.com/servers/tape-formerly-lenstube-980882088783913010',
        permanent: true
      },
      {
        source: '/donate',
        destination: 'https://giveth.io/project/tape',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/10/0x8de918f0163b2021839a8d84954dd7e8e151326d/0x8de918f0163b2021839a8d84954dd7e8e151326d-3',
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
