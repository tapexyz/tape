/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['utils', '@lenstube/constants', '@lenstube/lens'],
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Access-Control-Max-Methods', value: 'OPTIONS, POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
