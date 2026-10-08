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
    ],
  },
};

export default nextConfig;
