import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resilience Rituals',
  description: 'Build unbreakable emotional resilience, one ritual at a time.',
  keywords: ['resilience', 'mental health', 'habits', 'wellness', 'mindfulness'],
  authors: [{ name: 'Resilience Rituals Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: 'hsl(220, 80%, 50%)',
  openGraph: {
    title: 'Resilience Rituals',
    description: 'Build unbreakable emotional resilience, one ritual at a time.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resilience Rituals',
    description: 'Build unbreakable emotional resilience, one ritual at a time.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-bg">
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
