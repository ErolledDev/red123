import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '../components/ToastContainer'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

export const metadata: Metadata = {
  title: {
    default: 'SEO Redirection System - Boost Your Content Visibility 10x',
    template: '%s | SEO Redirection System'
  },
  description: 'Create powerful SEO-optimized redirections with custom meta tags to boost your content\'s search engine visibility and drive 10x more traffic. Generate clean URLs, sitemaps, and improve indexing.',
  keywords: ['SEO', 'redirection', 'meta tags', 'search engine optimization', 'URL shortener', 'sitemap', 'indexing', 'crawler'],
  authors: [{ name: 'SEO Redirection System' }],
  creator: 'SEO Redirection System',
  publisher: 'SEO Redirection System',
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
    siteName: 'SEO Redirection System',
    title: 'SEO Redirection System - Boost Your Content Visibility 10x',
    description: 'Create powerful SEO-optimized redirections with custom meta tags to boost your content\'s search engine visibility and drive 10x more traffic.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SEO Redirection System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Redirection System - Boost Your Content Visibility 10x',
    description: 'Create powerful SEO-optimized redirections with custom meta tags to boost your content\'s search engine visibility and drive 10x more traffic.',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <ToastProvider>
          {children}
        </ToastProvider>
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SEO Redirection System",
              "description": "Create powerful SEO-optimized redirections with custom meta tags to boost your content's search engine visibility and drive 10x more traffic.",
              "url": baseUrl,
              "applicationCategory": "SEO Tool",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </body>
    </html>
  )
}