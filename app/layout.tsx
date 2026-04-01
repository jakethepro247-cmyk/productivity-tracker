import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rekt Productivity',
  description: 'A high-performance objective and time tracking workspace.',
  openGraph: {
    title: 'Rekt Productivity',
    description: 'A high-performance objective and time tracking workspace.',
    type: 'website',
    siteName: 'Rekt Track',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rekt Productivity',
    description: 'A high-performance objective and time tracking workspace.',
  },
  icons: {
    icon: '/icon.svg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-white selection:bg-red-500/30`}>
        {children}
      </body>
    </html>
  )
}
