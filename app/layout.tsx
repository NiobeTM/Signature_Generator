import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { AuthGuard } from '@/components/auth-guard'
import { APP_BG_SRC } from '@/lib/preloadAppBackground'
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
        url: '/favicon.ico?v=5',
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=5" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=5" />
        {/* Fallback PNG favicon (in case the browser prefers PNG for some reason). */}
        <link rel="icon" type="image/png" href="/elkak-tab-icon-v2.png?v=5" />
        <link rel="shortcut icon" type="image/png" href="/elkak-tab-icon-v2.png?v=5" />
        {/* fetchpriority="high" tells the browser to start fetching the background
            image before CSS is even parsed — reduces first-load flash. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preload" as="image" href={APP_BG_SRC} fetchPriority="high" />
      </head>
      <body className="font-sans antialiased relative">
        {/* Full-viewport image layer (not CSS on html) paints reliably after client navigations. */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <img
            src={APP_BG_SRC}
            alt=""
            className="block h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
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
