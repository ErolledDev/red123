'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocialShare from '../../components/SocialShare'
import RelatedPosts from '../../components/RelatedPosts'
import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

function RedirectPageContent() {
  const searchParams = useSearchParams()
  const [allRedirects, setAllRedirects] = useState<{ [slug: string]: RedirectData }>({})
  const [currentUrl, setCurrentUrl] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const title = searchParams.get('title') || 'Redirect Page'
  const desc = searchParams.get('desc') || 'This is a redirect page'
  const url = searchParams.get('url') || '/'
  const image = searchParams.get('image') || ''
  const keywords = searchParams.get('keywords') || ''
  const siteName = searchParams.get('site_name') || ''
  const type = searchParams.get('type') || 'website'

  const hashtags = keywords ? keywords.split(',').map(k => k.trim()) : []

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
      document.title = `${title} | SEO Redirects Pro`
    }
  }, [title])

  useEffect(() => {
    const fetchRedirects = async () => {
      try {
        const response = await fetch('/api/get-redirects')
        if (response.ok) {
          const data = await response.json()
          setAllRedirects(data)
        }
      } catch (error) {
        console.error('Error fetching redirects:', error)
      }
    }
    
    if (mounted) {
      fetchRedirects()
    }
  }, [mounted])

  const continueReading = () => {
    if (typeof window !== 'undefined') {
      window.location.href = url
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SimpleHeader />
        <main className="max-w-4xl mx-auto px-6 py-8 flex-grow">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </main>
        <SimpleFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 flex-grow">
        <article>
          <header className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {siteName && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-gray-500">{siteName}</span>
                </>
              )}
              <span className="hidden sm:inline text-gray-400">•</span>
              <time className="text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {title}
            </h1>
            
            {keywords && (
              <div className="flex flex-wrap gap-2 mb-8">
                {keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            )}

            {image && (
              <div className="mb-8">
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                  loading="eager"
                />
              </div>
            )}
          </header>
          
          <div className="prose prose-lg prose-gray max-w-none mb-8">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light">
              {desc}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-blue-100">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Want to Read the Full Article?
              </h2>
              <p className="text-gray-600 mb-6 text-base sm:text-lg">
                Continue reading to discover more insights, detailed analysis, and actionable tips.
              </p>
              <button
                onClick={continueReading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center mx-auto"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Continue Reading
              </button>
            </div>
          </div>

          {mounted && currentUrl && (
            <div className="mb-12">
              <SocialShare
                url={currentUrl}
                title={title}
                description={desc}
                image={image}
                hashtags={hashtags}
              />
            </div>
          )}
        </article>

        <RelatedPosts 
          allRedirects={allRedirects} 
          currentSlug="parameter-based"
          currentKeywords={keywords}
          showSearch={true}
        />
      </main>

      <SimpleFooter />
    </div>
  )
}

export default function RedirectPage() {
  return <RedirectPageContent />
}