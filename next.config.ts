import type { NextConfig } from "next";

const CAVLI_CDN = "https://d8wojkg2185gh.cloudfront.net";

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
  // The CDN sends no CORS headers, so the browser loads models from our own origin.
  async rewrites() {
    return [
      {
        source: "/models/:file([A-Za-z0-9_]+\\.glb)",
        destination: `${CAVLI_CDN}/strapi/:file`,
      },
    ];
  },
};

export default nextConfig;
