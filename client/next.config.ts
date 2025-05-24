import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  // Explicitly disable experimental features that cause issues
  experimental: {
    // Explicitly disable React Compiler
    reactCompiler: false,
  },
};

export default nextConfig;
