import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Geist_Mono, Montserrat } from 'next/font/google'
import { siteUrl } from '@/lib/format'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
