import { createRequire } from "node:module";
import path from "node:path";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

const require = createRequire(import.meta.url);
const hwpjsBrowserEntry = path.join(
  path.dirname(require.resolve("@ohah/hwpjs/package.json")),
  "dist",
  "hwpjs.wasi-browser.js",
);

type WebpackWarningLike = {
  message?: unknown;
  module?: {
    resource?: unknown;
  };
};

const isHwpjsTopLevelAwaitWarning = (warning: unknown) => {
  if (!warning || typeof warning !== "object") {
    return false;
  }

  const typedWarning = warning as WebpackWarningLike;

  return (
    typeof typedWarning.module?.resource === "string" &&
    typedWarning.module.resource.includes("hwpjs.wasi-browser.js") &&
    typeof typedWarning.message === "string" &&
    typedWarning.message.includes("topLevelAwait")
  );
};

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  transpilePackages: ["ui", "shared", "utils", "config-tailwind"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@ohah/hwpjs$": hwpjsBrowserEntry,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      (warning: unknown) => isHwpjsTopLevelAwaitWarning(warning),
    ];

    return config;
  },
};

export default nextConfig;
