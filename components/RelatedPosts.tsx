'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

interface RelatedPostsProps {
  allRedirects: { [slug: string]: RedirectData }
  currentSlug: string
  currentKeywords?: string
  showSearch?: boolean
}

export default function RelatedPosts({ allRedirects, currentSlug, currentKeywords, showSearch = false }: RelatedPostsProps) {
  const [visiblePosts, setVisiblePosts] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter out current post and get related posts
  const getRelatedPosts = () => {
    if (!allRedirects || typeof allRedirects !== 'object') {
      return []
    }

    const posts = Object.entries(allRedirects).filter(([slug]) => slug !== currentSlug)
    
    // Apply search filter if search term exists
    let filteredPosts = posts
    if (searchTerm) {
      filteredPosts = posts.filter(([slug, data]) =>
        slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.keywords && data.keywords.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (currentKeywords && !searchTerm) {
      const currentKeywordList = currentKeywords.toLowerCase().split(',').map(k => k.trim())
      
      // Sort by keyword relevance
      const sortedPosts = filteredPosts.sort(([, dataA], [, dataB]) => {
        const keywordsA = dataA.keywords ? dataA.keywords.toLowerCase().split(',').map(k => k.trim()) : []
        const keywordsB = dataB.keywords ? dataB.keywords.toLowerCase().split(',').map(k => k.trim()) : []
        
        const matchesA = keywordsA.filter(k => currentKeywordList.includes(k)).length
        const matchesB = keywordsB.filter(k => currentKeywordList.includes(k)).length
        
        return matchesB - matchesA
      })
      
      return sortedPosts
    }
    
    return filteredPosts
  }

  const allRelatedPosts = getRelatedPosts()
  const displayedPosts = allRelatedPosts.slice(0, visiblePosts)

  const loadMorePosts = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisiblePosts(prev => Math.min(prev + 6, allRelatedPosts.length))
      setIsLoading(false)
    }, 500)
  }

  // Reset visible posts when search term changes
  useEffect(() => {
    if (isClient) {
      const totalPosts = getRelatedPosts().length
      setVisiblePosts(Math.min(12, totalPosts))
    }
  }, [searchTerm, allRedirects, isClient])

  // Don't render on server side to prevent hydration issues
  if (!isClient) {
    return (
      <section className="border-t border-gray-200 pt-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (allRelatedPosts.length === 0 && !searchTerm) {
    return null
  }

  return (
    <section className="border-t border-gray-200 pt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
        <p className="text-gray-600 mb-6">Discover more content that might interest you</p>
        
        {/* Search Input */}
        {showSearch && (
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search related articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* No results message */}
      {allRelatedPosts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search terms or browse all articles below.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map(([slug, data]) => (
          <Link key={slug} href={`/${slug}`} className="group">
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              {data.image && (
                <div className="aspect-video overflow-hidden flex-shrink-0">
                  <img 
                    src={data.image} 
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                    {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                  </span>
                  {data.site_name && (
                    <>
                      <span>•</span>
                      <span>{data.site_name}</span>
                    </>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {data.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {data.desc}
                </p>
                
                {data.keywords && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {data.keywords.split(',').slice(0, 3).map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{keyword.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 mt-auto">
                  Read More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {/* Load More Button */}
      {visiblePosts < allRelatedPosts.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMorePosts}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                Load More Articles
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {visiblePosts} of {allRelatedPosts.length} articles
          </p>
        </div>
      )}

      {/* Show all loaded message */}
      {visiblePosts >= allRelatedPosts.length && allRelatedPosts.length > 12 && (
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            All articles loaded
          </div>
        </div>
      )}
    </section>
  )
}