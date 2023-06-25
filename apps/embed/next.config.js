/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@lenstube/lens',
    '@lenstube/browser',
    '@lenstube/generic',
    '@lenstube/constants',
    'web-ui'
  ],
  reactStrictMode: true,
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
}

module.exports = nextConfig
