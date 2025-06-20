'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function GoogleAnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return

    // Prevent loading in development
    if (process.env.NODE_ENV === 'development') return

    // Load Google Analytics script with performance optimizations
    const script1 = document.createElement('script')
    script1.async = true
    script1.defer = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script1.onload = () => {
      // Initialize gtag after script loads
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      window.gtag = gtag
      
      gtag('js', new Date())
      gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true, // GDPR compliance
        allow_google_signals: false, // Privacy-focused
        allow_ad_personalization_signals: false,
      })
    }
    
    document.head.appendChild(script1)

    return () => {
      // Cleanup on unmount
      if (document.head.contains(script1)) {
        document.head.removeChild(script1)
      }
    }
  }, [GA_ID])

  useEffect(() => {
    if (!GA_ID || !window.gtag || process.env.NODE_ENV === 'development') return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Track page view with performance timing
    window.gtag('config', GA_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'page_load_time'
      }
    })

    // Track Core Web Vitals
    if ('web-vital' in window) {
      // @ts-ignore
      window['web-vital'].getCLS((metric: any) => {
        window.gtag('event', 'web_vital', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000),
          non_interaction: true,
        })
      })
    }
  }, [pathname, searchParams, GA_ID])

  return null
}

export default function GoogleAnalytics() {
  return <GoogleAnalyticsContent />
}

// Enhanced analytics hook with performance tracking
export const useGoogleAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        non_interaction: false,
      })
    }
  }

  const trackTiming = (name: string, value: number, category: string = 'Performance') => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: value,
        event_category: category,
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

  const trackPerformance = (metric: string, value: number) => {
    trackTiming(metric, value, 'Core_Web_Vitals')
  }

  return {
    trackEvent,
    trackTiming,
    trackRedirectCreation,
    trackRedirectClick,
    trackSitemapDownload,
    trackUrlCopy,
    trackPerformance,
  }
}