/** @type {import('next').NextConfig} */
const nextConfig = {
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
