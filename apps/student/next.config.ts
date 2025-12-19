import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["ui", "config-tailwind"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
