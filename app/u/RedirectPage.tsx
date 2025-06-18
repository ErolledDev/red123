'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocialShare from '../../components/SocialShare'
import RelatedPosts from '../../components/RelatedPosts'


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

function RedirectPageContent() {
  const searchParams = useSearchParams()
  const [allRedirects, setAllRedirects] = useState<{ [slug: string]: RedirectData }>({})
  
  const title = searchParams.get('title') || 'Redirect Page'
  const desc = searchParams.get('desc') || 'This is a redirect page'
  const url = searchParams.get('url') || '/'
  const image = searchParams.get('image') || ''
  const keywords = searchParams.get('keywords') || ''
  const siteName = searchParams.get('site_name') || ''
  const type = searchParams.get('type') || 'website'

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const hashtags = keywords ? keywords.split(',').map(k => k.trim()) : []

  // Fetch all redirects for related posts
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
    
    fetchRedirects()
  }, [])

  // Update document title and meta tags
  useEffect(() => {
    document.title = `${title} | seo360`
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', desc)

    // Update keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
    ]

    if (image) {
      ogTags.push({ property: 'og:image', content: image })
    }

    if (siteName) {
      ogTags.push({ property: 'og:site_name', content: siteName })
    }

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('property', tag.property)
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', tag.content)
    })

    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc },
    ]

    if (image) {
      twitterTags.push({ name: 'twitter:image', content: image })
    }

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', tag.name)
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', tag.content)
    })

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

  }, [title, desc, url, image, keywords, siteName, type])

  const continueReading = () => {
    window.location.href = url
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
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {siteName && (
                <>
                  <span>•</span>
                  <span>{siteName}</span>
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
              {title}
            </h1>
            
            {/* Keywords as tags */}
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
          </div>

          {/* Featured Image */}
          {image && (
            <div className="mb-8">
              <img 
                src={image} 
                alt={title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                loading="eager"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg prose-gray max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              {desc}
            </p>
          </div>

          {/* Continue Reading CTA */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 mb-8 border border-primary-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want to Read the Full Article?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Continue reading to discover more insights, detailed analysis, and actionable tips that can help you achieve your goals.
              </p>
              <button
                onClick={continueReading}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center mx-auto"
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
              title={title}
              description={desc}
              image={image}
              hashtags={hashtags}
            />
          </div>
        </article>

        {/* Related Posts Section with Search */}
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
