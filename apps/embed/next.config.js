/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'utils'])

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
  }
})

module.exports = nextConfig
