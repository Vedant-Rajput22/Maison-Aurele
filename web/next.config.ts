import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
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
};

export default nextConfig;
