import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure Turbopack using the modern configuration 
  turbopack: {
    // Turbopack configuration options
  },
  serverExternalPackages: [],
  images: {
    domains: ['localhost'], // Add any domains you need for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
  // Configure webpack for production
  productionBrowserSourceMaps: true, // Enable source maps in production
  
  // Use a different approach for service worker
  async rewrites() {
    return [
      {
        source: '/service-worker.js',
        destination: '/_next/static/service-worker.js',
      },
    ];
  },
};

export default nextConfig;
