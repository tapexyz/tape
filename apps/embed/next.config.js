/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
        source: '/(.*)'
      }
    ]
  },
  reactStrictMode: true,
  transpilePackages: [
    '@tape.xyz/lens',
    '@tape.xyz/browser',
    '@tape.xyz/generic',
    '@tape.xyz/config',
    '@tape.xyz/ui'
  ]
}

module.exports = nextConfig
