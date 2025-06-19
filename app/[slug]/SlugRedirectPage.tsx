'use client'

import SocialShare from '../../components/SocialShare'
import RelatedPosts from '../../components/RelatedPosts'
import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'
import { useEffect, useState } from 'react'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

interface Props {
  data: RedirectData
  allRedirects: { [slug: string]: RedirectData }
  currentSlug: string
}

export default function SlugRedirectPage({ data, allRedirects, currentSlug }: Props) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [mounted, setMounted] = useState(false)
  const hashtags = data.keywords ? data.keywords.split(',').map(k => k.trim()) : []

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
      document.title = `${data.title} | SEO Redirects Pro`
    }
  }, [data.title])

  const continueReading = () => {
    if (typeof window !== 'undefined') {
      window.location.href = data.url
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SimpleHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-6 sm:mb-8"></div>
            <div className="h-48 sm:h-64 bg-gray-200 rounded mb-6 sm:mb-8"></div>
          </div>
        </main>
        <SimpleFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
        <article>
          {/* Article Header */}
          <header className="mb-8 sm:mb-12">
            {/* Improved responsive metadata section */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap">
                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
              </span>
              {data.site_name && (
                <>
                  <span className="text-gray-500 text-xs sm:text-sm flex-1 min-w-0 truncate">
                    {data.site_name}
                  </span>
                </>
              )}
              <time className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: window.innerWidth < 640 ? 'short' : 'long', 
                  day: 'numeric' 
                })}
              </time>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              {data.title}
            </h1>
            
            {data.keywords && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {data.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            )}

            {data.image && (
              <div className="mb-6 sm:mb-8">
                <img 
                  src={data.image} 
                  alt={data.title}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  loading="eager"
                />
              </div>
            )}
          </header>
          
          {/* Article Content */}
          <div className="prose prose-sm sm:prose-lg prose-gray max-w-none mb-6 sm:mb-8">
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed font-light">
              {data.desc}
            </p>
          </div>

          {/* Continue Reading CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-blue-100">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Want to Read the Full Article?
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                Continue reading to discover more insights, detailed analysis, and actionable tips.
              </p>
              <button
                onClick={continueReading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Continue Reading
              </button>
            </div>
          </div>

          {/* Social Share */}
          {mounted && currentUrl && (
            <div className="mb-8 sm:mb-12">
              <SocialShare
                url={currentUrl}
                title={data.title}
                description={data.desc}
                image={data.image}
                hashtags={hashtags}
              />
            </div>
          )}
        </article>

        {/* Related Posts */}
        <RelatedPosts 
          allRedirects={allRedirects} 
          currentSlug={currentSlug}
          currentKeywords={data.keywords}
          showSearch={true}
        />
      </main>

      <SimpleFooter />
    </div>
  )
}