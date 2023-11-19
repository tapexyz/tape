/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@dragverse/lens',
    '@dragverse/browser',
    '@dragverse/generic',
    '@dragverse/config',
    '@dragverse/ui'
  ],
  reactStrictMode: true,
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
