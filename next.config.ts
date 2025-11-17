import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'heifereum-bucket.sgp1.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;
