/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@tape.xyz/lens",
    "@tape.xyz/browser",
    "@tape.xyz/generic",
    "@tape.xyz/tsconfig",
    "@tape.xyz/ui",
  ],
  reactStrictMode: true,
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000" }],
      },
    ];
  },
};

module.exports = nextConfig;
