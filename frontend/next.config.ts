import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api',
        destination: 'http://0.0.0.0:8000',
      },
    ]
  },
}

export default nextConfig;
