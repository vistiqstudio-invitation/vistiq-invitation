import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { InvitationProvider } from "@/components/InvitationProvider";
import MetaPixel from "@/components/MetaPixel";
import LeadTracker from "@/components/LeadTracker";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PwaRegister from "@/components/PwaRegister";
import { cormorant, playfair, inter, alexBrush, suranna, readexPro, chelseaMarket, notoBalinese, notoSerifDisplay, raleway } from "@/lib/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vistiq Invitation",
  description: "Digital Invitation Platform",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vistiq Invitation",
  },
};

export const viewport: Viewport = {
  themeColor: "#1167b2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${inter.variable} ${alexBrush.variable} ${suranna.variable} ${readexPro.variable} ${chelseaMarket.variable} ${notoBalinese.variable} ${notoSerifDisplay.variable} ${raleway.variable}`}
      >
        <MetaPixel />
        <LeadTracker />
        <PwaRegister />
        <InvitationProvider>
          {children}
          <FloatingWhatsApp />
        </InvitationProvider>
      </body>
    </html>
  );
}
