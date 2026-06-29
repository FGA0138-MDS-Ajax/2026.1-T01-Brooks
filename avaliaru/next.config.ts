import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,

  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.app.github.dev",
      ],
    },
  },
};

export default nextConfig;