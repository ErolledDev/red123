'use client'
GoogleAnalytics.tsx
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-LYY5GTB778'

  useEffect(() => {
    if (!GA_ID) return

    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `
    document.head.appendChild(script2)

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [GA_ID])

  useEffect(() => {
    if (!GA_ID || !window.gtag) return

    const url = pathname + searchParams.toString()
    
    // Track page view
    window.gtag('config', GA_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [pathname, searchParams, GA_ID])

  return null
}

// Custom hook for tracking events
export const useGoogleAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackRedirectCreation = (slug: string, type: string) => {
    trackEvent('redirect_created', 'SEO_Redirects', `${type}_${slug}`)
  }

  const trackRedirectClick = (slug: string, source: string) => {
    trackEvent('redirect_clicked', 'User_Engagement', `${source}_${slug}`)
  }

  const trackSitemapDownload = () => {
    trackEvent('sitemap_downloaded', 'SEO_Tools', 'sitemap_xml')
  }

  const trackUrlCopy = (urlType: 'short' | 'long') => {
    trackEvent('url_copied', 'User_Engagement', urlType)
  }

  return {
    trackEvent,
    trackRedirectCreation,
    trackRedirectClick,
    trackSitemapDownload,
    trackUrlCopy,
  }
}
