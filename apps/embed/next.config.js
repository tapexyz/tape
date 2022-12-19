/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'utils', 'web-ui'])

const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/collect/:match*',
        destination: 'https://api.mixpanel.com/:match*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }]
      }
    ]
  }
})

module.exports = nextConfig
