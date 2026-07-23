import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vistiq Invitation",
    short_name: "Vistiq",
    description: "Platform undangan digital - pernikahan, aqiqah, dan khitan.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6faff",
    theme_color: "#1167b2",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
