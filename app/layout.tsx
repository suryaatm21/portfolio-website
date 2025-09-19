import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Urbanist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AnimatedBackground from '@/components/AnimatedBackground';
import { FXMounts } from '@/components/FX/FXMounts';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400'],
});

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
  weight: ['600'],
});

export const metadata: Metadata = {
  title: 'Surya - Full Stack Developer | Modern Web Solutions',
  description:
    'Personal portfolio of Surya - Full Stack Developer specializing in modern web technologies, React, Next.js, and scalable applications. Building the future of browser productivity.',
  keywords: [
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Web Development',
    'JavaScript',
    'Portfolio',
  ],
  authors: [{ name: 'Surya' }],
  creator: 'Surya',
  publisher: 'Surya',
  generator: 'Next.js',
  applicationName: 'Surya Portfolio',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2D3748' },
    { media: '(prefers-color-scheme: dark)', color: '#E2E8F0' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Surya - Full Stack Developer | Modern Web Solutions',
    description:
      'Personal portfolio of Surya - Full Stack Developer specializing in modern web technologies, React, Next.js, and scalable applications.',
    siteName: 'Surya Portfolio',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Surya - Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya - Full Stack Developer | Modern Web Solutions',
    description:
      'Personal portfolio of Surya - Full Stack Developer specializing in modern web technologies.',
    images: ['/og.png'],
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      className={`${inter.variable} ${urbanist.variable}`}
      suppressHydrationWarning>
      <body className="bg-background text-foreground font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
