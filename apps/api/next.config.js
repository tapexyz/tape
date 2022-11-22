/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['utils', 'lens'])

const nextConfig = withTM({
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }]
  }
})

module.exports = nextConfig
