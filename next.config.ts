import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();
const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(","),
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;
