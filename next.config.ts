import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },  
  ignoreBuildErrors: true,
};

export default nextConfig;
