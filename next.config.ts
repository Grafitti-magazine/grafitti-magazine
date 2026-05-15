import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.0.107"],

  /**
   * Image Optimization
   * Configure to allow images from WordPress domain
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.flyweb.space",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
