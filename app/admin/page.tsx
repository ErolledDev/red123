'use client'

import { useState, useEffect } from 'react'
import { useToast } from '../../components/ToastContainer'
import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  video?: string // Added video field
  keywords: string
  site_name: string
  type: string
  created_at?: string
  updated_at?: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

interface CreateRedirectResponse {
  long: string
  short: string
  slug: string
  success: boolean
  warning?: string
  error?: string
  data?: RedirectData
  isUpdate?: boolean
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [isLoading, setIsLoading] = useState(false)
  const [redirects, setRedirects] = useState<RedirectsData>({})
  const [filteredRedirects, setFilteredRedirects] = useState<RedirectsData>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState<'title' | 'type' | 'recent'>('recent')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<CreateRedirectResponse | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const { showSuccess, showError, showConfirm } = useToast()

  // Form state - Added video field
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    url: '',
    image: '',
    video: '', // New video field
    keywords: '',
    site_name: '',
    type: 'article',
    slug: ''
  })

  // Load redirects on component mount and tab change
  useEffect(() => {
    if (activeTab === 'manage') {
      loadRedirects()
    }
  }, [activeTab])

  // Filter and sort redirects
  useEffect(() => {
    let filtered = { ...redirects }

    // Apply search filter
    if (searchTerm) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([slug, data]) =>
          slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (data.keywords && data.keywords.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (data.site_name && data.site_name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([, data]) => data.type === filterType)
      )
    }

    // Apply sorting
    const sortedEntries = Object.entries(filtered).sort(([slugA, dataA], [slugB, dataB]) => {
      switch (sortBy) {
        case 'title':
          return dataA.title.localeCompare(dataB.title)
        case 'type':
          return dataA.type.localeCompare(dataB.type)
        case 'recent':
        default:
          // Sort by created_at date (most recent first)
          const dateA = new Date(dataA.created_at || dataA.updated_at || '1970-01-01').getTime()
          const dateB = new Date(dataB.created_at || dataB.updated_at || '1970-01-01').getTime()
          return dateB - dateA
      }
    })

    setFilteredRedirects(Object.fromEntries(sortedEntries))
  }, [redirects, searchTerm, filterType, sortBy])

  const loadRedirects = async () => {
    try {
      const response = await fetch('/api/get-redirects')
      if (response.ok) {
        const data = await response.json()
        setRedirects(data)
      } else {
        showError('Failed to load redirects', 'Please try again later.')
      }
    } catch (error) {
      console.error('Error loading redirects:', error)
      showError('Error loading redirects', 'Please check your connection and try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (slug: string, data: RedirectData) => {
    setFormData({
      title: data.title,
      desc: data.desc,
      url: data.url,
      image: data.image || '',
      video: data.video || '', // Include video in edit
      keywords: data.keywords || '',
      site_name: data.site_name || '',
      type: data.type,
      slug: slug
    })
    setEditingSlug(slug)
    setActiveTab('create')
  }

  const handleCancelEdit = () => {
    setEditingSlug(null)
    setFormData({
      title: '',
      desc: '',
      url: '',
      image: '',
      video: '', // Reset video field
      keywords: '',
      site_name: '',
      type: 'article',
      slug: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result: CreateRedirectResponse = await response.json()

      if (response.ok && result.success) {
        setSuccessData(result)
        setShowSuccessModal(true)
        
        // Reset form
        setFormData({
          title: '',
          desc: '',
          url: '',
          image: '',
          video: '', // Reset video field
          keywords: '',
          site_name: '',
          type: 'article',
          slug: ''
        })
        setEditingSlug(null)

        const action = result.isUpdate ? 'updated' : 'created'
        if (result.warning) {
          showSuccess(`Redirect ${action}!`, result.warning)
        } else {
          showSuccess(`Redirect ${action} successfully!`, `Your SEO-optimized redirect is now live and ready for indexing.`)
        }

        // Reload redirects if we're on manage tab
        if (activeTab === 'manage') {
          loadRedirects()
        }
      } else {
        showError('Failed to save redirect', result.error || 'Please try again.')
      }
    } catch (error) {
      console.error('Error saving redirect:', error)
      showError('Network error', 'Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    showConfirm(
      'Delete Redirect',
      `Are you sure you want to delete "${slug}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`/api/delete-redirect?slug=${encodeURIComponent(slug)}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            showSuccess('Redirect deleted', `Successfully deleted "${slug}"`)
            loadRedirects()
          } else {
            const error = await response.json()
            showError('Failed to delete redirect', error.error || 'Please try again.')
          }
        } catch (error) {
          console.error('Error deleting redirect:', error)
          showError('Network error', 'Please check your connection and try again.')
        }
      },
      undefined,
      'Delete',
      'Cancel'
    )
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess(`${type} copied!`, 'The URL has been copied to your clipboard.')
    } catch (err) {
      showError('Copy failed', 'Please copy the URL manually.')
    }
  }

  const getUniqueTypes = () => {
    const types = new Set(Object.values(redirects).map(data => data.type))
    return Array.from(types).sort()
  }

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your SEO redirects with video support and boost your search engine visibility</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('create')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{editingSlug ? 'Edit Redirect' : 'Create Redirect'}</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Manage Redirects</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {Object.keys(redirects).length}
                  </span>
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Create/Edit Redirect Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {editingSlug ? 'Edit Redirect' : 'Create New Redirect'}
                  </h2>
                  <p className="text-gray-600">
                    {editingSlug 
                      ? 'Update the details below to modify your existing redirect.'
                      : 'Fill in the details below to create an SEO-optimized redirect with optional video content.'
                    }
                  </p>
                </div>
                {editingSlug && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              {editingSlug && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Editing:</strong> /{editingSlug}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter an engaging, SEO-friendly title"
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Write a compelling description that includes your target keywords"
                  />
                </div>

                {/* Target URL */}
                <div className="lg:col-span-2">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    Target URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://example.com/your-target-page"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Video URL - NEW FIELD */}
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                    <span className="text-xs text-gray-500 ml-2">(YouTube, Vimeo, TikTok, Direct links)</span>
                  </label>
                  <input
                    type="url"
                    id="video"
                    name="video"
                    value={formData.video}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: YouTube, Vimeo, TikTok, Dailymotion, or direct video file links (.mp4, .webm, .ogg)
                  </p>
                </div>

                {/* Site Name */}
                <div>
                  <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="site_name"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your Site Name"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                <div className="lg:col-span-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Slug {editingSlug ? '(Read-only when editing)' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    readOnly={!!editingSlug}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      editingSlug ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="custom-url-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editingSlug 
                      ? 'Slug cannot be changed when editing an existing redirect'
                      : 'Leave empty to auto-generate from title'
                    }
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
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
          </div>
        )}

        {/* Manage Redirects Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search redirects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Type Filter */}
                <div className="sm:w-48">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    {getUniqueTypes().map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'title' | 'type' | 'recent')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="title">Title A-Z</option>
                    <option value="type">Type</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {Object.keys(filteredRedirects).length} of {Object.keys(redirects).length} redirects
              </div>
            </div>

            {/* Redirects Grid */}
            {Object.keys(filteredRedirects).length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No redirects found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Create your first redirect to get started.'
                  }
                </p>
                {(!searchTerm && filterType === 'all') && (
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create First Redirect
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(filteredRedirects).map(([slug, data]) => {
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
                  const longUrl = `${baseUrl}/u?${new URLSearchParams({
                    title: data.title,
                    desc: data.desc,
                    url: data.url,
                    ...(data.image && { image: data.image }),
                    ...(data.video && { video: data.video }), // Include video in URL params
                    ...(data.keywords && { keywords: data.keywords }),
                    ...(data.site_name && { site_name: data.site_name }),
                    type: data.type
                  }).toString()}`

                  return (
                    <div key={slug} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                      {/* Media Preview - Show video or image */}
                      {(data.video || data.image) && (
                        <div className="aspect-video overflow-hidden flex-shrink-0 bg-gray-100">
                          {data.video ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                              <div className="text-center">
                                <svg className="w-12 h-12 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium text-purple-700">Video Content</p>
                                <p className="text-xs text-purple-600">Click to view</p>
                              </div>
                            </div>
                          ) : data.image && (
                            <img 
                              src={data.image} 
                              alt={data.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                            </span>
                            {data.video && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Video
                              </span>
                            )}
                          </div>
                          {data.site_name && (
                            <span className="text-xs text-gray-500 truncate ml-2 max-w-24">
                              {data.site_name}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {data.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                          {data.desc}
                        </p>

                        {/* Keywords */}
                        {data.keywords && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {data.keywords.split(',').slice(0, 3).map((keyword, index) => (
                              <span 
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs truncate max-w-20"
                                title={keyword.trim()}
                              >
                                #{keyword.trim()}
                              </span>
                            ))}
                            {data.keywords.split(',').length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                +{data.keywords.split(',').length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Date */}
                        <div className="text-xs text-gray-500 mb-4">
                          Created: {formatDate(data.created_at)}
                          {data.updated_at && data.updated_at !== data.created_at && (
                            <div>Updated: {formatDate(data.updated_at)}</div>
                          )}
                        </div>

                        {/* URLs */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 w-12 flex-shrink-0">Short:</span>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                              /{slug}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${baseUrl}/${slug}`, 'Short URL')}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                              title="Copy short URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 w-12 flex-shrink-0">Long:</span>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate" title={longUrl}>
                              {truncateUrl(longUrl, 35)}
                            </code>
                            <button
                              onClick={() => copyToClipboard(longUrl, 'Long URL')}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                              title="Copy long URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                          <a
                            href={`/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View
                          </a>
                          <button
                            onClick={() => handleEdit(slug, data)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(slug)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Redirect {successData.isUpdate ? 'Updated' : 'Created'} Successfully!
                    </h3>
                    <p className="text-gray-600">Your SEO-optimized redirect is now live</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Preview Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                {successData.data?.image && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img 
                      src={successData.data.image} 
                      alt={successData.data.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {successData.data?.type ? (successData.data.type.charAt(0).toUpperCase() + successData.data.type.slice(1)) : 'Article'}
                  </span>
                  {successData.data?.video && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Video
                    </span>
                  )}
                  {successData.data?.site_name && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">{successData.data.site_name}</span>
                    </>
                  )}
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {successData.data?.title}
                </h4>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {successData.data?.desc}
                </p>

                {successData.data?.keywords && (
                  <div className="flex flex-wrap gap-2">
                    {successData.data.keywords.split(',').slice(0, 5).map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                      >
                        #{keyword.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={successData.short}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(successData.short, 'Short URL')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Long URL (with parameters)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={successData.long}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(successData.long, 'Long URL')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-900 mb-2">🎉 What's Next?</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Your redirect is automatically added to the sitemap</li>
                  <li>• Search engines will discover it within 24-48 hours</li>
                  <li>• Share the short URL to start driving traffic</li>
                  <li>• Monitor performance in Google Search Console</li>
                  {successData.data?.video && <li>• Video content will enhance engagement and SEO</li>}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <a
                href={successData.short}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Redirect
              </a>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  )
}