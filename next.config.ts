import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.CLOUDFLARE_BUILD === "1",
    // Support current R2 uploads and older public Supabase Storage
    // assets. next/image rejects remote hosts that are not declared here,
    // which made successfully uploaded bride/groom photos render as an empty
    // grey frame in themes that use the Image component.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.vistiqinvitation.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
