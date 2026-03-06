import type { Metadata } from "next";
import {
  Inter,
  Urbanist,
  Space_Grotesk,
  Manrope,
  Outfit,
  DM_Sans,
  Oxanium,
} from "next/font/google";
import type React from "react";

import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { FXMounts } from "@/components/FX/FXMounts";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
  weight: ["600"],
});

/* ── Font preview instances ─────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["600", "700"],
});

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oxanium",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Surya's Portfolio Website",
  description:
    "Surya Atmuri - full stack developer specializing in modern web technologies, cloud/data driven systems, and scalable applications. Building the future of browser productivity.",
  keywords: [
    "Full Stack Developer",
    "Cloud Computing Infrastructure",
    "Applied AI",
    "Machine, Deep Learning",
    "Data Driven Systems",
    "Surya Atmuri",
    "Portfolio",
    "Personal Website",
  ],
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon_io/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon_io/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  authors: [{ name: "Surya Atmuri" }],
  creator: "Surya Atmuri",
  publisher: "Surya Atmuri",
  generator: "Next.js",
  applicationName: "Surya's Portfolio",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2D3748" },
    { media: "(prefers-color-scheme: dark)", color: "#E2E8F0" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://surya.theuntab.com",
    title: "Surya - Full Stack Developer | Modern Web Solutions",
    description:
      " surya atmuri - full stack developer specializing in scalable web technologies, cloud computing, and applied AI.",
    siteName: "Surya's Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Surya - Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Surya Atmuri - Full Stack Developer | Modern Web Solutions",
    description:
      "Personal portfolio of Surya Atmuri - Full Stack Developer specializing in modern web technologies.",
    images: ["/og.png"],
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${urbanist.variable} ${spaceGrotesk.variable} ${manrope.variable} ${outfit.variable} ${dmSans.variable} ${oxanium.variable}`}
      suppressHydrationWarning>
      <body className="bg-background text-foreground font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange>
          <AnimatedBackground />
          <FXMounts />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
