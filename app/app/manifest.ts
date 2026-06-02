import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deal Finder Wilmington",
    short_name: "Deal Finder",
    description: "Source-grounded Wilmington, NC restaurant food deals.",
    start_url: "/tonight",
    display: "standalone",
    background_color: "#f4f6f2",
    theme_color: "#17352f",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
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
