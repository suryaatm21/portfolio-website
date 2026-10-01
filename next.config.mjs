import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    // Next's defaults plus content/, which `next lint` otherwise skips.
    dirs: ["pages", "app", "components", "lib", "src", "content"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: workspaceRoot,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

export default nextConfig;
