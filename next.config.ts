import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server's client resources (HMR, hydration) to be served to
  // these hosts when accessing the dev server from another device.
  allowedDevOrigins: ["100.82.238.53", "192.168.1.88", "10.47.10.9"],
};

export default nextConfig;
