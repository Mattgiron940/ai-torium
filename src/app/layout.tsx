import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-TORIUM - Advanced AI Learning Platform',
  description: 'Get instant AI-powered explanations, step-by-step solutions, and personalized tutoring for any subject. Master complex concepts with AI-TORIUM.',
  keywords: ['AI tutoring', 'education', 'learning platform', 'homework help', 'AI explanations'],
  authors: [{ name: 'AI-TORIUM Team' }],
  creator: 'AI-TORIUM',
  publisher: 'AI-TORIUM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ai-torium.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI-TORIUM - Advanced AI Learning Platform',
    description: 'Get instant AI-powered explanations, step-by-step solutions, and personalized tutoring for any subject.',
    url: 'https://ai-torium.com',
    siteName: 'AI-TORIUM',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI-TORIUM - Advanced AI Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-TORIUM - Advanced AI Learning Platform',
    description: 'Get instant AI-powered explanations, step-by-step solutions, and personalized tutoring for any subject.',
    images: ['/og-image.png'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}