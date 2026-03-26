import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'https://res.cloudinary.com/:path*',
      },
    ];
  },
};

export default nextConfig;
