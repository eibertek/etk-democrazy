import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
