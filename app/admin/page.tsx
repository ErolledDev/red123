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

interface FormData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
  slug: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    desc: '',
    url: '',
    image: '',
    keywords: '',
    site_name: '',
    type: 'article',
    slug: ''
  })
  const [redirects, setRedirects] = useState<RedirectsData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedUrls, setGeneratedUrls] = useState<{long: string, short: string} | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'type'>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { showSuccess, showError, showConfirm } = useToast()
  const { trackRedirectCreation, trackUrlCopy } = useGoogleAnalytics()

  // Load existing redirects
  useEffect(() => {
    fetchRedirects()
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      const hamburger = document.getElementById('hamburger-button')
      
      if (isSidebarOpen && sidebar && hamburger && 
          !sidebar.contains(event.target as Node) && 
          !hamburger.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSidebarOpen])

  // Close sidebar when tab changes on mobile
  const handleTabChange = (tab: 'create' | 'manage') => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
  }

  const fetchRedirects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/get-redirects')
      if (response.ok) {
        const data = await response.json()
        setRedirects(data)
      } else {
        showError('Failed to load redirects', 'Please refresh the page and try again.')
      }
    } catch (error) {
      console.error('Error fetching redirects:', error)
      showError('Network Error', 'Unable to connect to the server.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.desc.trim() || !formData.url.trim()) {
      showError('Missing Required Fields', 'Please fill in title, description, and URL.')
      return
    }

    setIsSubmitting(true)
    setGeneratedUrls(null)

    try {
      const submitData = {
        ...formData,
        slug: editingSlug || formData.slug || generateSlug(formData.title)
      }

      const response = await fetch('/api/create-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (response.ok) {
        setGeneratedUrls({
          long: result.long,
          short: result.short
        })
        
        showSuccess(
          editingSlug ? 'Redirect Updated!' : 'Redirect Created!',
          `Your SEO-optimized redirect is ready and will be indexed by search engines.`
        )

        // Track the creation
        trackRedirectCreation(result.slug, formData.type)

        // Reset form if creating new (not editing)
        if (!editingSlug) {
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
        }

        // Refresh redirects list
        await fetchRedirects()
        
        // Clear editing state
        setEditingSlug(null)
      } else {
        showError('Creation Failed', result.error || 'Unable to create redirect. Please try again.')
      }
    } catch (error) {
      console.error('Error creating redirect:', error)
      showError('Network Error', 'Unable to connect to the server. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'short' | 'long') => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Copied!', `${type === 'short' ? 'Short' : 'Long'} URL copied to clipboard`)
      trackUrlCopy(type)
    } catch (err) {
      showError('Copy Failed', 'Unable to copy to clipboard')
    }
  }

  const handleEdit = (slug: string, data: RedirectData) => {
    setFormData({
      title: data.title,
      desc: data.desc,
      url: data.url,
      image: data.image,
      keywords: data.keywords,
      site_name: data.site_name,
      type: data.type,
      slug: slug
    })
    setEditingSlug(slug)
    setActiveTab('create')
    setGeneratedUrls(null)
    setIsSidebarOpen(false) // Close sidebar on mobile when editing
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
            showSuccess('Deleted!', 'Redirect has been successfully deleted.')
            await fetchRedirects()
          } else {
            const result = await response.json()
            showError('Delete Failed', result.error || 'Unable to delete redirect.')
          }
        } catch (error) {
          console.error('Error deleting redirect:', error)
          showError('Network Error', 'Unable to connect to the server.')
        }
      },
      () => {},
      'Delete',
      'Cancel'
    )
  }

  const cancelEdit = () => {
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

  // Generate long URL for display
  const generateLongUrl = (slug: string, data: RedirectData) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      title: data.title,
      desc: data.desc,
      url: data.url,
      ...(data.image && { image: data.image }),
      ...(data.keywords && { keywords: data.keywords }),
      ...(data.site_name && { site_name: data.site_name }),
      type: data.type
    })
    return `${baseUrl}/u?${params.toString()}`
  }

  // Filter and sort redirects
  const filteredRedirects = Object.entries(redirects).filter(([slug, data]) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      slug.toLowerCase().includes(searchLower) ||
      data.title.toLowerCase().includes(searchLower) ||
      data.desc.toLowerCase().includes(searchLower) ||
      (data.keywords && data.keywords.toLowerCase().includes(searchLower))
    )
  }).sort(([slugA, dataA], [slugB, dataB]) => {
    let compareValue = 0
    
    switch (sortBy) {
      case 'title':
        compareValue = dataA.title.localeCompare(dataB.title)
        break
      case 'type':
        compareValue = dataA.type.localeCompare(dataB.type)
        break
      case 'date':
        compareValue = slugA.localeCompare(slugB) // Using slug as proxy for creation order
        break
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">SEO Redirects Pro</p>
            </div>
          </div>
          
          <button
            id="hamburger-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
        )}

        {/* Left Sidebar Navigation */}
        <div
          id="sidebar"
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            w-80 lg:w-72 bg-white shadow-2xl lg:shadow-lg border-r border-gray-200 
            flex flex-col transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">SEO Redirects Pro</p>
              </div>
            </div>
          </div>

          {/* Mobile Header in Sidebar */}
          <div className="lg:hidden p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">SEO Redirects Pro</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-3">
              <button
                onClick={() => handleTabChange('create')}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'create' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">Create Redirect</span>
                  <p className="text-xs text-gray-500 mt-1">Build SEO-optimized redirects</p>
                </div>
              </button>

              <button
                onClick={() => handleTabChange('manage')}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === 'manage'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'manage' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">Manage Redirects</span>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                      {Object.keys(redirects).length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Edit and organize redirects</p>
                </div>
              </button>
            </div>
          </nav>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-4">
              {/* Stats */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Redirects</span>
                  <span className="text-lg font-bold text-blue-600">{Object.keys(redirects).length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((Object.keys(redirects).length / 50) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Object.keys(redirects).length < 50 
                    ? `${50 - Object.keys(redirects).length} more to reach 50`
                    : 'Great job! You\'ve created many redirects'
                  }
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <a
                  href="/"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Home</span>
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Sitemap</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {/* Create Redirect Tab */}
            {activeTab === 'create' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 lg:p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {editingSlug ? 'Edit Redirect' : 'Create New Redirect'}
                    </h2>
                    <p className="text-gray-600">
                      {editingSlug 
                        ? 'Update your redirect details below'
                        : 'Generate SEO-optimized redirects that get indexed by search engines instantly'
                      }
                    </p>
                    {editingSlug && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="text-blue-800 font-medium">Editing: {editingSlug}</span>
                          </div>
                          <button
                            onClick={cancelEdit}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Cancel Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="lg:col-span-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Enter an engaging, SEO-friendly title"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        <label htmlFor="desc" className="block text-sm font-semibold text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          id="desc"
                          name="desc"
                          value={formData.desc}
                          onChange={handleInputChange}
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Write a compelling description that will appear in search results and social media"
                          required
                        />
                      </div>

                      {/* Target URL */}
                      <div>
                        <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                          Target URL *
                        </label>
                        <input
                          type="url"
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="https://example.com/your-content"
                          required
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      {/* Keywords */}
                      <div>
                        <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                          Keywords
                        </label>
                        <input
                          type="text"
                          id="keywords"
                          name="keywords"
                          value={formData.keywords}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="SEO, marketing, growth (comma-separated)"
                        />
                      </div>

                      {/* Site Name */}
                      <div>
                        <label htmlFor="site_name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          id="site_name"
                          name="site_name"
                          value={formData.site_name}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Your Brand Name"
                        />
                      </div>

                      {/* Content Type */}
                      <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                          Content Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="input-field"
                        >
                          <option value="article">Article</option>
                          <option value="website">Website</option>
                          <option value="product">Product</option>
                          <option value="video">Video</option>
                          <option value="book">Book</option>
                          <option value="profile">Profile</option>
                        </select>
                      </div>

                      {/* Custom Slug */}
                      <div>
                        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
                          Custom Slug (Optional)
                        </label>
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="custom-url-slug"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to auto-generate from title
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {editingSlug ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {editingSlug ? 'Update Redirect' : 'Create Redirect'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Generated URLs */}
                  {generatedUrls && (
                    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingSlug ? 'Redirect Updated Successfully!' : 'Redirect Created Successfully!'}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-2">Short URL (SEO Optimized)</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={generatedUrls.short}
                              readOnly
                              className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(generatedUrls.short, 'short')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-2">Long URL (Parameter Rich)</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={generatedUrls.long}
                              readOnly
                              className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(generatedUrls.long, 'long')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-700">
                          🎉 Your redirect is now live and will be automatically included in the sitemap for search engine indexing!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manage Redirects Tab */}
            {activeTab === 'manage' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 lg:p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Manage Redirects</h2>
                    <p className="text-gray-600">View, edit, and delete your existing redirects</p>
                  </div>

                  {/* Search and Filter Controls */}
                  <div className="mb-6 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search redirects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | 'type')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="title">Sort by Title</option>
                        <option value="type">Sort by Type</option>
                        <option value="date">Sort by Date</option>
                      </select>
                      
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <svg className={`w-5 h-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>

                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`px-3 py-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-3 py-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Redirects List */}
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-gray-600">Loading redirects...</p>
                    </div>
                  ) : filteredRedirects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'No matching redirects' : 'No redirects yet'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search terms'
                          : 'Create your first redirect to get started'
                        }
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => handleTabChange('create')}
                          className="btn-primary"
                        >
                          Create First Redirect
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                      {filteredRedirects.map(([slug, data]) => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                        const shortUrl = `${baseUrl}/${slug}`
                        const longUrl = generateLongUrl(slug, data)

                        return viewMode === 'grid' ? (
                          // Grid View
                          <div key={slug} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            {/* Image */}
                            {data.image && (
                              <div className="aspect-video overflow-hidden">
                                <img 
                                  src={data.image} 
                                  alt={data.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            
                            <div className="p-4">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {data.type}
                                  </span>
                                  {data.site_name && (
                                    <span className="text-xs text-gray-500">{data.site_name}</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleEdit(slug, data)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit redirect"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDelete(slug)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete redirect"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                  
                                  <a
                                    href={`/${slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    title="View redirect"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                              
                              {/* Title */}
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {data.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {data.desc}
                              </p>
                              
                              {/* URLs */}
                              <div className="space-y-2 mb-3">
                                <div>
                                  <label className="text-xs font-medium text-gray-500">Short URL</label>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <input
                                      type="text"
                                      value={shortUrl}
                                      readOnly
                                      className="flex-1 text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-700"
                                    />
                                    <button
                                      onClick={() => copyToClipboard(shortUrl, 'short')}
                                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                      title="Copy short URL"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-xs font-medium text-gray-500">Long URL</label>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <input
                                      type="text"
                                      value={longUrl}
                                      readOnly
                                      className="flex-1 text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-700"
                                    />
                                    <button
                                      onClick={() => copyToClipboard(longUrl, 'long')}
                                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                      title="Copy long URL"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Keywords */}
                              {data.keywords && (
                                <div className="flex flex-wrap gap-1">
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
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div key={slug} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-start gap-4">
                              {/* Image */}
                              {data.image && (
                                <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                                  <img 
                                    src={data.image} 
                                    alt={data.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                      {data.title}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {data.type}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => handleEdit(slug, data)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit redirect"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDelete(slug)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete redirect"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                    
                                    <a
                                      href={`/${slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                      title="View redirect"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {data.desc}
                                </p>
                                
                                {/* URLs in List View */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="text-xs font-medium text-gray-500">Short URL</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <input
                                        type="text"
                                        value={shortUrl}
                                        readOnly
                                        className="flex-1 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700"
                                      />
                                      <button
                                        onClick={() => copyToClipboard(shortUrl, 'short')}
                                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                        title="Copy short URL"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-xs font-medium text-gray-500">Long URL</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <input
                                        type="text"
                                        value={longUrl}
                                        readOnly
                                        className="flex-1 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700"
                                      />
                                      <button
                                        onClick={() => copyToClipboard(longUrl, 'long')}
                                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                        title="Copy long URL"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      /{slug}
                                    </span>
                                    {data.site_name && (
                                      <>
                                        <span>•</span>
                                        <span>{data.site_name}</span>
                                      </>
                                    )}
                                    {data.keywords && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center">
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                          </svg>
                                          {data.keywords.split(',').length} keywords
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  
                                  {data.keywords && (
                                    <div className="flex flex-wrap gap-1">
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
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}