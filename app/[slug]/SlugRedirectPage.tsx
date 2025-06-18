'use client'

import SocialShare from '../../components/SocialShare'
import RelatedPosts from '../../components/RelatedPosts'
import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'
import { useEffect } from 'react'

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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const hashtags = data.keywords ? data.keywords.split(',').map(k => k.trim()) : []

  // Update document title to match the fixed format
  useEffect(() => {
    document.title = `${data.title} | seo360`
  }, [data.title])

  const continueReading = () => {
    window.location.href = data.url
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 flex-grow">
        {/* Article Header */}
        <article className="mb-12">
          {/* Article Meta */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
              </span>
              {data.site_name && (
                <>
                  <span>•</span>
                  <span>{data.site_name}</span>
                </>
              )}
              <span>•</span>
              <time dateTime={new Date().toISOString()}>
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
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
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                loading="eager"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg prose-gray max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              {data.desc}
            </p>
          </div>

          {/* Continue Reading CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want to Read the Full Article?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Continue reading to discover more insights, detailed analysis, and actionable tips that can help you achieve your goals.
              </p>
              <button
                onClick={continueReading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center mx-auto"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Continue Reading
              </button>
            </div>
          </div>

          {/* Social Share */}
          <div className="mb-12">
            <SocialShare
              url={currentUrl}
              title={data.title}
              description={data.desc}
              image={data.image}
              hashtags={hashtags}
            />
          </div>
        </article>

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