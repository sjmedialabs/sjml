/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/services/media-planing", destination: "/services/media-planning", permanent: true },
      { source: "/services/media-planing/:path*", destination: "/services/media-planning/:path*", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/insights/brand-strategy-2026.", destination: "/insights/brand-strategy-2026", permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: "/api/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/((?!api/images).*)",
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
