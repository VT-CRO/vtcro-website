import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Geist_Mono, Montserrat } from 'next/font/google'
import { siteUrl } from '@/lib/format'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Browser-tab icon: the VT CRO bird on a transparent background, black on light tabs and white on dark tabs.
  // (The light version is listed last so browsers that ignore `media` fall back to it.)
  icons: {
    icon: [
      { url: '/favicon-dark.png', type: 'image/png', sizes: '192x192', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-light.png', type: 'image/png', sizes: '192x192', media: '(prefers-color-scheme: light)' },
    ],
    // Home-screen icon on iPhone/iPad (iOS needs a solid square here).
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0c0e',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  )
}
