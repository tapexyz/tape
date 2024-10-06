/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    typedRoutes: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

export default nextConfig;
