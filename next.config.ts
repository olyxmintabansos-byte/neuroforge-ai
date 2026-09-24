import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/neuroforge-ai",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
