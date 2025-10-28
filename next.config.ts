import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // Sin output: 'export' para poder usar APIs del servidor
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    DATABASE_PROVIDER: process.env.DATABASE_PROVIDER || 'postgresql',
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
