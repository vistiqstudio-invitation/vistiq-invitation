import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { InvitationProvider } from "@/components/InvitationProvider";
import MetaPixel from "@/components/MetaPixel";
import LeadTracker from "@/components/LeadTracker";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { cormorant, playfair, inter, alexBrush, suranna, readexPro, chelseaMarket } from "@/lib/fonts";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${inter.variable} ${alexBrush.variable} ${suranna.variable} ${readexPro.variable} ${chelseaMarket.variable}`}
      >
        <MetaPixel />
        <LeadTracker />
        <InvitationProvider>
          {children}
          <FloatingWhatsApp />
        </InvitationProvider>
      </body>
    </html>
  );
}
