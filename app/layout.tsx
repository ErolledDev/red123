import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '../components/ToastContainer'
import { Suspense } from 'react'
import GoogleAnalytics from '../components/GoogleAnalytics'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SEO Redirects Pro - Instant Google Indexing & Traffic Boost',
    template: '%s | SEO Redirects Pro'
  },
  description: 'Create SEO-optimized redirects that get indexed by Google in 24 hours. Boost organic traffic, improve rankings, and dominate search results with our professional redirect system.',
  keywords: ['SEO redirects', 'Google indexing', 'organic traffic', 'search rankings', 'backlinks', 'URL shortener', 'sitemap optimization', 'search engine optimization'],
  authors: [{ name: 'SEO Redirects Pro', url: baseUrl }],
  creator: 'SEO Redirects Pro',
  publisher: 'SEO Redirects Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@seoredirectspro',
    creator: '@seoredirectspro',
    title: 'SEO Redirects Pro - Instant Google Indexing & Traffic Boost',
    description: 'Create SEO-optimized redirects that get indexed by Google in 24 hours. Boost organic traffic and dominate search results.',
    images: [`${baseUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION_CODE || '',
    },
  },
  category: 'technology',
  classification: 'SEO Tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className="min-h-screen bg-white antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
        
        {/* Structured Data */}
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
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0.0",
              "datePublished": "2025-01-01",
              "dateModified": new Date().toISOString().split('T')[0],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-01"
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
                "Mobile-First Design",
                "Video Content Support",
                "Markdown Editor",
                "Social Media Sharing"
              ],
              "provider": {
                "@type": "Organization",
                "name": "SEO Redirects Pro",
                "url": baseUrl,
                "logo": `${baseUrl}/favicon-32x32.png`,
                "sameAs": [
                  "https://twitter.com/seoredirectspro"
                ]
              },
              "mainEntity": {
                "@type": "WebApplication",
                "name": "SEO Redirects Pro",
                "url": baseUrl,
                "description": "Professional SEO redirect management system"
              }
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SEO Redirects Pro",
              "url": baseUrl,
              "logo": `${baseUrl}/favicon-32x32.png`,
              "description": "Professional SEO redirect system for instant Google indexing and traffic optimization.",
              "foundingDate": "2025",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@seoredirects.com",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://twitter.com/seoredirectspro"
              ]
            })
          }}
        />
      </body>
    </html>
  )
}