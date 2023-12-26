/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Access-Control-Max-Methods', value: 'OPTIONS, POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ],
        source: '/:path*'
      }
    ]
  },
  reactStrictMode: true,
  async rewrites() {
    return [{ destination: '/api/:path*', source: '/:path*' }]
  },
  transpilePackages: [
    '@tape.xyz/browser',
    '@tape.xyz/generic',
    '@tape.xyz/lens'
  ]
}

module.exports = nextConfig
