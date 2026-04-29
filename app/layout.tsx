import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
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
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        {analyticsEnabled && <Analytics />}
      </body>
    </html>
  )
}
