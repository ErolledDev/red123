import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '../components/ToastContainer'
import { Suspense } from 'react'
import GoogleAnalytics from '../components/GoogleAnalytics'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

export const metadata: Metadata = {
  title: {
    default: 'SEO Redirects Pro - Supercharge Your SEO & Backlinks with Smart Redirects',
    template: '%s | SEO Redirects Pro'
  },
  description: 'Create powerful SEO-optimized redirections that get instantly indexed by Google, Bing & all major search engines. Perfect for affiliate marketers, bloggers, and content creators who want to dominate search results and drive 10x more traffic.',
  keywords: ['SEO redirects', 'affiliate marketing', 'backlinks', 'search engine optimization', 'URL shortener', 'sitemap', 'indexing', 'crawler', 'content marketing', 'digital marketing', 'traffic generation', 'search rankings'],
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
    title: 'SEO Redirects Pro - Supercharge Your SEO & Backlinks with Smart Redirects',
    description: 'Create powerful SEO-optimized redirections that get instantly indexed by Google, Bing & all major search engines. Perfect for affiliate marketers, bloggers, and content creators.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SEO Redirects Pro - Supercharge Your SEO & Backlinks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Redirects Pro - Supercharge Your SEO & Backlinks with Smart Redirects',
    description: 'Create powerful SEO-optimized redirections that get instantly indexed by Google, Bing & all major search engines. Perfect for affiliate marketers, bloggers, and content creators.',
    images: [`${baseUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
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
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <ToastProvider>
          {children}
        </ToastProvider>
        
        {/* Enhanced JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SEO Redirects Pro",
              "description": "Create powerful SEO-optimized redirections that get instantly indexed by Google, Bing & all major search engines. Perfect for affiliate marketers, bloggers, and content creators.",
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
                "Lightning Fast Google Indexing",
                "Premium Backlink Power",
                "Smart Meta Optimization",
                "Zero Technical Skills Required",
                "Analytics Ready",
                "Enterprise Grade Security"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": [
                  "Affiliate Marketers",
                  "Content Creators",
                  "Bloggers",
                  "YouTubers",
                  "Business Owners",
                  "Digital Marketing Agencies",
                  "SEO Professionals"
                ]
              },
              "provider": {
                "@type": "Organization",
                "name": "SEO Redirects Pro",
                "url": baseUrl,
                "logo": `${baseUrl}/logo.png`,
                "sameAs": [
                  "https://twitter.com/seoredirectspro",
                  "https://linkedin.com/company/seoredirectspro"
                ]
              }
            })
          }}
        />
      </body>
    </html>
  )
}