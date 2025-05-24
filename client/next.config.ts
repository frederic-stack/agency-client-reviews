import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Railway deployment
  output: 'standalone',
  
  // Optimize images for production
  images: {
    unoptimized: true,
  },
  
  // Enable compression
  compress: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
  },
  
  // Experimental features
  experimental: {
    // Enable React Compiler for better performance
    reactCompiler: true,
  },
};

export default nextConfig;
