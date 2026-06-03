import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Forkcast Wilmington",
    short_name: "Forkcast",
    description: "Today's forecast for Wilmington, NC food specials.",
    start_url: "/tonight",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#2377ad",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
