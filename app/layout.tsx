import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import SiteTopBar from "@/components/layout/SiteTopBar";

const serif = Source_Serif_4({
  variable: "--font-serif-body",
  subsets: ["latin"],
  display: "swap",
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interactive IS-LM Simulator",
  description:
    "Explore the IS-LM framework with an interactive simulator and guided learning topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${sans.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteTopBar />
          <main className="flex-1">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
