/** @type {import('next').NextConfig} */
const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook|metainspector|twitterbot).*'
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
    scrollRestoration: true
  },
  async rewrites() {
    return [
      {
        source: '/sitemaps/:match*',
        destination: 'https://static.tape.xyz/sitemaps/:match*'
      },
      {
        source: '/u/:match*',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        destination: 'https://og.tape.xyz/u/:match*'
      },
      {
        source: '/watch/:match*',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        destination: 'https://og.tape.xyz/watch/:match*'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/channel/:handle(.+).lens',
        destination: '/u/:handle',
        permanent: true
      },
      {
        source: '/channel/:handle(.+).test',
        destination: '/u/:handle',
        permanent: true
      },
      {
        source: '/channel/:handle',
        destination: '/u/:handle',
        permanent: true
      },
      {
        source: '/channel/:namespace/:handle',
        destination: '/u/:namespace/:handle',
        permanent: true
      },
      {
        source: '/signup',
        destination: '/login?signup=true',
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
          'https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-5',
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
