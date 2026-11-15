// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "192.168.56.1",
    "localhost",
    "127.0.0.1",
  ],
  async redirects() {
    return [
      // La página antigua de perfil se consolidó en /perfil.
      { source: "/profile", destination: "/perfil", permanent: true },
    ];
  },
};

export default nextConfig;