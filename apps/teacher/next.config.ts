import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  transpilePackages: ["ui", "shared", "utils", "config-tailwind"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
