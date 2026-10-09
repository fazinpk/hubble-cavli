import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mmiconnectstorage.azureedge.net",
        pathname: "/global-profile/**",
      },
      {
        protocol: "https",
        hostname: "d8wojkg2185gh.cloudfront.net",
        pathname: "/strapi/**",
      },
    ],
  },
};

export default nextConfig;
