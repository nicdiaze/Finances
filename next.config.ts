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
};

export default nextConfig;
