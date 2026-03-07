import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import type React from "react";

import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { BirdsProvider } from "@/components/FX/BirdsProvider";
import { FXMounts } from "@/components/FX/FXMounts";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["500", "600", "700"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://surya.theuntab.com"),
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://surya.theuntab.com",
    title: "Surya - Full Stack Developer | Modern Web Solutions",
    description:
      "Surya Atmuri - full stack developer specializing in scalable web technologies, cloud computing, and applied AI.",
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
    creator: "@suryaatm21",
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

/* Moved from metadata export – required by Next.js 15+ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2D3748" },
    { media: "(prefers-color-scheme: dark)", color: "#E2E8F0" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning>
      <body className="bg-background text-foreground font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange>
          <BirdsProvider>
            <AnimatedBackground />
            <FXMounts />
            <div className="relative z-10">
              {children}
              <Toaster />
            </div>
          </BirdsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
