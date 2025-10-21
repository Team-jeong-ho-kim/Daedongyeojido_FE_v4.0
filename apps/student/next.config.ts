import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["ui", "config-tailwind"],
};

export default nextConfig;
