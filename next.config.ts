import type { NextConfig } from "next";

const config = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api',
        destination: 'http://0.0.0.0:8000',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  // Add exportPathMap to handle static generation of error pages
  exportPathMap: async function (defaultPathMap: Record<string, { page: string; query?: Record<string, string> }>) {
    return {
      ...defaultPathMap,
      '/404': { page: '/404' },
    };
  },
  // Disable static optimization for error-related pages
  experimental: {
    // This ensures proper handling of dynamic routes
    isrMemoryCacheSize: 0,
    // This ensures proper handling of client components in not-found
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = config;

export default config as NextConfig;
