/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['utils', 'lens'])

const nextConfig = withTM({
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://lenstube.xyz' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Access-Control-Max-Methods', value: 'POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ]
  }
})

module.exports = nextConfig
