import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { InvitationProvider } from "@/components/InvitationProvider";
import { cormorant, playfair, inter, alexBrush, suranna } from "@/lib/fonts";

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
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${inter.variable} ${alexBrush.variable} ${suranna.variable}`}
      >
        <InvitationProvider>
          {children}
        </InvitationProvider>
      </body>
    </html>
  );
}