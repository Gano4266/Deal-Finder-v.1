import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deal Finder Wilmington",
  description: "Source-grounded Wilmington, NC restaurant food deals.",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deal Finder"
  }
};

export const viewport: Viewport = {
  themeColor: "#17352f",
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
        {children}
      </body>
    </html>
  );
}
