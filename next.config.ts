import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the local dev server usable through the loopback address as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  // The bottom-left dev indicator overlaps the footer's group command.
  devIndicators: false,
};

export default nextConfig;
