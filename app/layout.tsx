import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { AuthGuard } from '@/components/auth-guard'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Email Signature Generator - ΕΛΚΑΚ',
  description: 'Generate professional email signatures for ΕΛΚΑΚ in English and Greek',
  generator: 'it-department.app',
  icons: {
    // Keep metadata favicon consistent with the explicit links in <head>.
    // The previous '/icon.svg' was overriding the tab icon.
    icon: [
      {
        url: '/favicon.ico?v=2',
        type: 'image/x-icon',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'

  return (
    <html lang="en">
      <head>
        {/* Extra explicit favicon tags for reliability (browser caching/refresh quirks). */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=2" />
        {/* Fallback PNG favicon (in case the browser prefers PNG for some reason). */}
        <link rel="icon" type="image/png" href="/elkak-tab-icon-v2.png?v=2" />
        <link rel="shortcut icon" type="image/png" href="/elkak-tab-icon-v2.png?v=2" />
        {/* fetchpriority="high" tells the browser to start fetching the background
            image before CSS is even parsed — reduces first-load flash. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preload" as="image" href="/app-bg.png" fetchPriority="high" />
      </head>
      <body className="font-sans antialiased relative">
        {/* Force-fetch + decode the background image even in strict/no-disk-cache modes (e.g. incognito).
            Using a real <img> avoids relying on CSS background fetch timing. */}
        <img
          src="/app-bg.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{
            position: "fixed",
            width: 1,
            height: 1,
            left: -9999,
            top: -9999,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <div className="relative z-10">
          <AuthGuard>
            {children}
          </AuthGuard>
        </div>
        <Toaster />
        {analyticsEnabled && <Analytics />}
      </body>
    </html>
  )
}
