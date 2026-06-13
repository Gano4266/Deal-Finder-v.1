import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { AppHeader } from "./app-header";
import { FilterDockScrollController } from "./filter-dock-scroll-controller";
import { PrimaryNav } from "./primary-nav";
import { QueryScrollRestorer } from "./query-scroll-restorer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forkcast",
  description: "Today's forecast for food specials worth knowing.",
  icons: {
    icon: [
      { url: "/icon.svg?v=20260613b", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png?v=20260613b", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=20260613b", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png?v=20260613b", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=20260613b", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png?v=20260613b", sizes: "180x180", type: "image/png" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Forkcast"
  }
};

export const viewport: Viewport = {
  themeColor: "#2377ad",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <PrimaryNav />
        <Suspense fallback={null}>
          <QueryScrollRestorer />
          <FilterDockScrollController />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
