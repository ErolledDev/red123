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

// Skeleton Loading Component
function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-white flex flex-col animate-pulse">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 flex-grow">
        <div className="mb-12">
          {/* Meta Information Skeleton */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 rounded-full h-6 w-16"></div>
                <span className="hidden sm:inline">•</span>
                <div className="bg-gray-200 rounded h-4 w-20"></div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline">•</span>
                <div className="bg-gray-200 rounded h-4 w-24"></div>
              </div>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="bg-gray-200 rounded h-8 w-full"></div>
              <div className="bg-gray-200 rounded h-8 w-4/5"></div>
              <div className="bg-gray-200 rounded h-8 w-3/4"></div>
            </div>
            
            {/* Keywords Skeleton */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-full h-6 w-16"></div>
              ))}
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="mb-8">
            <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="mb-8 space-y-3">
            <div className="bg-gray-200 rounded h-6 w-full"></div>
            <div className="bg-gray-200 rounded h-6 w-5/6"></div>
            <div className="bg-gray-200 rounded h-6 w-4/5"></div>
          </div>

          {/* CTA Skeleton */}
          <div className="bg-gray-100 rounded-2xl p-8 mb-8">
            <div className="text-center space-y-4">
              <div className="bg-gray-200 rounded h-8 w-3/4 mx-auto"></div>
              <div className="bg-gray-200 rounded h-6 w-5/6 mx-auto"></div>
              <div className="bg-gray-200 rounded-xl h-12 w-48 mx-auto"></div>
            </div>
          </div>

          {/* Social Share Skeleton */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-12">
            <div className="bg-gray-200 rounded h-6 w-32 mb-4"></div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-10 w-24"></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  )
}

export default function SlugRedirectPage({ data, allRedirects, currentSlug }: Props) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const hashtags = data.keywords ? data.keywords.split(',').map(k => k.trim()) : []

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // Update document title only on client side
  useEffect(() => {
    if (mounted && typeof document !== 'undefined' && !isLoading) {
      document.title = `${data.title} | seo360`
    }
  }, [data.title, mounted, isLoading])

  const continueReading = () => {
    if (typeof window !== 'undefined') {
      window.location.href = data.url
    }
  }

  const shareOnSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedTitle = encodeURIComponent(data.title)
    const encodedDesc = encodeURIComponent(data.desc)
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  // Show skeleton loading
  if (!mounted || isLoading) {
    return <SkeletonLoader />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 flex-grow">
        {/* Article Header */}
        <div className="mb-12">
          {/* Article Meta - Improved Responsive Design */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                </span>
                {data.site_name && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-gray-500 sm:text-gray-600">{data.site_name}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-gray-400">•</span>
                <span className="text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {data.title}
            </h1>
            
            {/* Keywords as tags */}
            {data.keywords && (
              <div className="flex flex-wrap gap-2 mb-8">
                {data.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {data.image && (
            <div className="mb-8">
              <img 
                src={data.image} 
                alt={data.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                loading="eager"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg prose-gray max-w-none mb-8">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light">
              {data.desc}
            </p>
          </div>

          {/* Enhanced Social Sharing CTAs */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-blue-100">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Love this content? Share it!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Help others discover this valuable information
              </p>
            </div>
            
            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <button
                onClick={() => shareOnSocial('facebook')}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              
              <button
                onClick={() => shareOnSocial('twitter')}
                className="flex items-center justify-center px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="flex items-center justify-center px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              
              <button
                onClick={() => shareOnSocial('whatsapp')}
                className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </button>
              
              <button
                onClick={() => shareOnSocial('telegram')}
                className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </button>
              
              <button
                onClick={() => shareOnSocial('reddit')}
                className="flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </button>
            </div>
          </div>

          {/* Continue Reading CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Want to Read the Full Article?
              </h3>
              <p className="text-gray-600 mb-6 text-base sm:text-lg">
                Continue reading to discover more insights, detailed analysis, and actionable tips that can help you achieve your goals.
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

          {/* Enhanced Social Share Component */}
          {mounted && currentUrl && (
            <div className="mb-12">
              <SocialShare
                url={currentUrl}
                title={data.title}
                description={data.desc}
                image={data.image}
                hashtags={hashtags}
              />
            </div>
          )}
        </div>

        {/* Related Posts Section with Search */}
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