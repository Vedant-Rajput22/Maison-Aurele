import type { NextConfig } from "next";

import path from "path";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: process.env.VERCEL
    ? undefined
    : {
      root: path.resolve(__dirname),
    },

  cacheLife: {
    page: {
      stale: 60,    // 1 minute
      revalidate: 300,  // 5 minutes
      expire: 3600,  // 1 hour
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.coverr.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Middleware replacement - using redirects instead of middleware.ts
  // This avoids the Turbopack middleware compilation bug
  async redirects() {
    return [
      // Redirect locale-prefixed admin paths to canonical /admin
      {
        source: '/en/admin/:path*',
        destination: '/admin/:path*',
        permanent: false,
      },
      {
        source: '/fr/admin/:path*',
        destination: '/admin/:path*',
        permanent: false,
      },
      {
        source: '/en/admin',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/fr/admin',
        destination: '/admin',
        permanent: false,
      },
    ];
  },

  // Default locale redirect for paths without locale prefix
  async rewrites() {
    return {
      beforeFiles: [
        // Redirect root to default locale
        {
          source: '/',
          destination: '/fr',
        },
      ],
    };
  },
};

export default nextConfig;
