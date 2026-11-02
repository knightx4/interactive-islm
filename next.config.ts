import type { NextConfig } from "next";
import { legacySlugs } from "./lib/learn/lessons";

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(legacySlugs).map(([from, to]) => ({
      source: `/learn/${from}`,
      destination: `/learn/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
