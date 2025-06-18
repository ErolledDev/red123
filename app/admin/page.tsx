'use client'

import { useState, useEffect } from 'react'
import { useToast } from '../../components/ToastContainer'
import { useGoogleAnalytics } from '../../components/GoogleAnalytics'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    url: '',
    image: '',
    keywords: '',
    site_name: '',
    type: 'article',
    slug: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [redirects, setRedirects] = useState<RedirectsData>({})
  const [isLoadingRedirects, setIsLoadingRedirects] = useState(true)
  const [generatedUrls, setGeneratedUrls] = useState<{long: string, short: string} | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const { showSuccess, showError, showConfirm } = useToast()
  const { trackRedirectCreation, trackUrlCopy } = useGoogleAnalytics()
  
  const itemsPerPage = 8

  // Load existing redirects
  useEffect(() => {
    loadRedirects()
  }, [])

  const loadRedirects = async () => {
    try {
      setIsLoadingRedirects(true)
      const response = await fetch('/api/get-redirects')
      if (response.ok) {
        const data = await response.json()
        setRedirects(data)
      }
    } catch (error) {
      console.error('Error loading redirects:', error)
      showError('Failed to load redirects', 'Please refresh the page to try again.')
    } finally {
      setIsLoadingRedirects(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.desc || !formData.url) {
      showError('Missing Required Fields', 'Please fill in title, description, and URL.')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/create-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setGeneratedUrls({
          long: result.long,
          short: result.short
        })
        
        showSuccess(
          editingSlug ? 'Redirect Updated!' : 'Redirect Created!',
          `Your SEO-optimized redirect is ready and will be indexed soon.`
        )
        
        trackRedirectCreation(result.slug, formData.type)
        
        // Reset form
        setFormData({
          title: '',
          desc: '',
          url: '',
          image: '',
          keywords: '',
          site_name: '',
          type: 'article',
          slug: ''
        })
        setEditingSlug(null)
        setShowCreateForm(false)
        
        // Reload redirects
        await loadRedirects()
      } else {
        showError('Creation Failed', result.error || 'Failed to create redirect. Please try again.')
      }
    } catch (error) {
      console.error('Error creating redirect:', error)
      showError('Network Error', 'Failed to connect to server. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (slug: string, data: RedirectData) => {
    setFormData({
      title: data.title,
      desc: data.desc,
      url: data.url,
      image: data.image || '',
      keywords: data.keywords || '',
      site_name: data.site_name || '',
      type: data.type || 'article',
      slug: slug
    })
    setEditingSlug(slug)
    setShowCreateForm(true)
    setGeneratedUrls(null)
  }

  const handleDelete = (slug: string) => {
    showConfirm(
      'Delete Redirect',
      `Are you sure you want to delete "${slug}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`/api/delete-redirect?slug=${encodeURIComponent(slug)}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            showSuccess('Redirect Deleted', `Successfully deleted "${slug}"`)
            await loadRedirects()
          } else {
            const result = await response.json()
            showError('Delete Failed', result.error || 'Failed to delete redirect')
          }
        } catch (error) {
          console.error('Error deleting redirect:', error)
          showError('Network Error', 'Failed to delete redirect. Please try again.')
        }
      },
      undefined,
      'Delete',
      'Cancel'
    )
  }

  const copyToClipboard = async (text: string, type: 'short' | 'long') => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Copied!', `${type === 'short' ? 'Short' : 'Long'} URL copied to clipboard`)
      trackUrlCopy(type)
    } catch (err) {
      showError('Copy Failed', 'Failed to copy URL to clipboard')
    }
  }

  // Utility function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Filter and paginate redirects
  const filteredRedirects = Object.entries(redirects).filter(([slug, data]) => {
    const matchesSearch = slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.desc.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || data.type === selectedType
    
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredRedirects.length / itemsPerPage)
  const paginatedRedirects = filteredRedirects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getTypeColor = (type: string) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      website: 'bg-green-100 text-green-800',
      product: 'bg-purple-100 text-purple-800',
      video: 'bg-red-100 text-red-800',
      book: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const stats = {
    total: Object.keys(redirects).length,
    articles: Object.values(redirects).filter(r => r.type === 'article').length,
    websites: Object.values(redirects).filter(r => r.type === 'website').length,
    products: Object.values(redirects).filter(r => r.type === 'product').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SEO Redirects Pro
                  </h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowCreateForm(!showCreateForm)
                  if (showCreateForm) {
                    setEditingSlug(null)
                    setFormData({
                      title: '',
                      desc: '',
                      url: '',
                      image: '',
                      keywords: '',
                      site_name: '',
                      type: 'article',
                      slug: ''
                    })
                    setGeneratedUrls(null)
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {showCreateForm ? 'Cancel' : 'New Redirect'}
              </button>
              
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </a>
              
              <a
                href="/sitemap.xml"
                target="_blank"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sitemap
              </a>
              
              <a
                href="/robots.txt"
                target="_blank"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Robots.txt
              </a>
            </nav>
          </div>

          {/* Stats Sidebar */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Redirects</span>
                <span className="text-sm font-semibold text-gray-900">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Articles</span>
                <span className="text-sm font-semibold text-blue-600">{stats.articles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Websites</span>
                <span className="text-sm font-semibold text-green-600">{stats.websites}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Products</span>
                <span className="text-sm font-semibold text-purple-600">{stats.products}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Manage your SEO redirects and monitor performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Redirects</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Index Success</p>
                    <p className="text-3xl font-bold text-gray-900">98%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">Excellent performance</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Index Time</p>
                    <p className="text-3xl font-bold text-gray-900">18h</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">-6h from average</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Traffic Boost</p>
                    <p className="text-3xl font-bold text-gray-900">247%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">Above industry avg</span>
                </div>
              </div>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingSlug ? 'Edit Redirect' : 'Create New Redirect'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {editingSlug ? 'Update your existing redirect' : 'Generate SEO-optimized redirects that get indexed fast'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter a compelling title for SEO"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          id="desc"
                          value={formData.desc}
                          onChange={(e) => setFormData({...formData, desc: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Write a detailed description for better SEO"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                          Target URL *
                        </label>
                        <input
                          type="url"
                          id="url"
                          value={formData.url}
                          onChange={(e) => setFormData({...formData, url: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="https://example.com/your-content"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Image URL
                        </label>
                        <input
                          type="url"
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="keywords"
                          value={formData.keywords}
                          onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="SEO, marketing, content strategy"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Site Name
                          </label>
                          <input
                            type="text"
                            id="site_name"
                            value={formData.site_name}
                            onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your Brand"
                          />
                        </div>

                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Content Type
                          </label>
                          <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="article">Article</option>
                            <option value="website">Website</option>
                            <option value="product">Product</option>
                            <option value="video">Video</option>
                            <option value="book">Book</option>
                          </select>
                        </div>
                      </div>

                      {editingSlug && (
                        <div>
                          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Slug (optional)
                          </label>
                          <input
                            type="text"
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="custom-url-slug"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingSlug(null)
                        setFormData({
                          title: '',
                          desc: '',
                          url: '',
                          image: '',
                          keywords: '',
                          site_name: '',
                          type: 'article',
                          slug: ''
                        })
                        setGeneratedUrls(null)
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingSlug ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        editingSlug ? 'Update Redirect' : 'Create Redirect'
                      )}
                    </button>
                  </div>
                </form>

                {/* Generated URLs */}
                {generatedUrls && (
                  <div className="p-6 bg-green-50 border-t border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">🎉 Redirect Created Successfully!</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">Short URL (SEO Optimized)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={generatedUrls.short}
                            readOnly
                            className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(generatedUrls.short, 'short')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">Long URL (Parameter Based)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={generatedUrls.long}
                            readOnly
                            className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(generatedUrls.long, 'long')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manage Redirects */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Manage Redirects</h2>
                    <p className="text-gray-600 mt-1">View, edit, and delete your existing redirects</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search redirects..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="article">Articles</option>
                      <option value="website">Websites</option>
                      <option value="product">Products</option>
                      <option value="video">Videos</option>
                      <option value="book">Books</option>
                    </select>
                  </div>
                </div>
              </div>

              {isLoadingRedirects ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg text-gray-600">Loading redirects...</span>
                  </div>
                </div>
              ) : paginatedRedirects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || selectedType !== 'all' ? 'No matching redirects' : 'No redirects yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Create your first redirect to get started with SEO optimization.'
                    }
                  </p>
                  {!searchTerm && selectedType === 'all' && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Your First Redirect
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-2/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redirect</th>
                          <th className="w-1/6 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedRedirects.map(([slug, data]) => (
                          <tr key={slug} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-start space-x-3">
                                {data.image && (
                                  <img 
                                    src={data.image} 
                                    alt={data.title}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate" title={data.title}>
                                    {truncateText(data.title, 60)}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1" title={data.desc}>
                                    {truncateText(data.desc, 160)}
                                  </p>
                                  <p className="text-xs text-blue-600 font-mono mt-1">/{slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(data.type)}`}>
                                {data.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <a
                                  href={`/${slug}`}
                                  target="_blank"
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                  title="View redirect"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  View
                                </a>
                                <button
                                  onClick={() => handleEdit(slug, data)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                  title="Edit redirect"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(slug)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                  title="Delete redirect"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRedirects.length)} of {filteredRedirects.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
