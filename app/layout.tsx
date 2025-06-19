import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '../components/ToastContainer'
import { Suspense } from 'react'
import GoogleAnalytics from '../components/GoogleAnalytics'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

export const metadata: Metadata = {
  title: {
    default: 'SEO Redirects Pro - Instant Google Indexing & Traffic Boost',
    template: '%s | SEO Redirects Pro'
  },
  description: 'Create SEO-optimized redirects that get indexed by Google in 24 hours. Boost organic traffic, improve rankings, and dominate search results with our professional redirect system.',
  keywords: ['SEO redirects', 'Google indexing', 'organic traffic', 'search rankings', 'backlinks', 'URL shortener', 'sitemap optimization'],
  authors: [{ name: 'SEO Redirects Pro' }],
  creator: 'SEO Redirects Pro',
  publisher: 'SEO Redirects Pro',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'SEO Redirects Pro',
    title: 'SEO Redirects Pro - Instant Google Indexing & Traffic Boost',
    description: 'Create SEO-optimized redirects that get indexed by Google in 24 hours. Boost organic traffic and dominate search results.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SEO Redirects Pro - Instant Google Indexing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Redirects Pro - Instant Google Indexing & Traffic Boost',
    description: 'Create SEO-optimized redirects that get indexed by Google in 24 hours. Boost organic traffic and dominate search results.',
    images: [`${baseUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className="min-h-screen bg-white">
        <ToastProvider>
          {children}
        </ToastProvider>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SEO Redirects Pro",
              "description": "Create SEO-optimized redirects that get indexed by Google in 24 hours. Professional redirect system for boosting organic traffic.",
              "url": baseUrl,
              "applicationCategory": "SEO Tool",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1247",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "24-Hour Google Indexing",
                "SEO-Optimized Redirects",
                "Automatic Sitemap Generation",
                "Analytics Integration",
                "Mobile-First Design"
              ],
              "provider": {
                "@type": "Organization",
                "name": "SEO Redirects Pro",
                "url": baseUrl
              }
            })
          }}
        />
      </body>
    </html>
  )
}