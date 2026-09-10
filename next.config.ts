import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Reseller/client uploads are stored in the public Supabase Storage
    // bucket. next/image rejects remote hosts that are not declared here,
    // which made successfully uploaded bride/groom photos render as an empty
    // grey frame in themes that use the Image component.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
