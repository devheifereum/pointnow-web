import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'heifereum-bucket.sgp1.digitaloceanspaces.com',
      },
    ],
    // Improve image loading for SEO
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Add headers for better CORS support
  async headers() {
    return [
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
