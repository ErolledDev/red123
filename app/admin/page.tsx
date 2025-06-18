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
  keywords: string
  site_name: string
  type: string
}

interface FormData extends RedirectData {
  slug: string
}

export default function AdminPage() {
  const { showSuccess, showError, showConfirm } = useToast()
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    desc: '',
    url: '',
    image: '',
    keywords: '',
    site_name: '',
    type: 'website',
    slug: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirects, setRedirects] = useState<{ [slug: string]: RedirectData }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [generatedUrls, setGeneratedUrls] = useState<{ long: string; short: string } | null>(null)

  // Load existing redirects
  useEffect(() => {
    fetchRedirects()
  }, [])

  const fetchRedirects = async () => {
    try {
      const response = await fetch('/api/get-redirects')
      if (response.ok) {
        const data = await response.json()
        setRedirects(data)
      }
    } catch (error) {
      console.error('Error fetching redirects:', error)
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  const handleEdit = (slug: string) => {
    const redirectData = redirects[slug]
    if (redirectData) {
      setFormData({
        ...redirectData,
        slug: slug
      })
      setEditingSlug(slug)
      setActiveTab('create')
    }
  }

  const handleCancelEdit = () => {
    setEditingSlug(null)
    setFormData({
      title: '',
      desc: '',
      url: '',
      image: '',
      keywords: '',
      site_name: '',
      type: 'website',
      slug: ''
    })
    setGeneratedUrls(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.desc || !formData.url) {
      showError('Validation Error', 'Title, description, and URL are required')
      return
    }

    setIsSubmitting(true)

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
        showSuccess('Success!', editingSlug ? 'Redirect updated successfully' : 'Redirect created successfully')
        setGeneratedUrls({
          long: result.long,
          short: result.short
        })
        
        // Reset form
        handleCancelEdit()
        
        // Refresh redirects list
        fetchRedirects()
      } else {
        showError('Error', result.error || 'Failed to create redirect')
      }
    } catch (error) {
      console.error('Error creating redirect:', error)
      showError('Error', 'Failed to create redirect. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (slug: string) => {
    showConfirm(
      'Delete Redirect',
      `Are you sure you want to delete the redirect "${slug}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`/api/delete-redirect?slug=${encodeURIComponent(slug)}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            showSuccess('Deleted', 'Redirect deleted successfully')
            fetchRedirects()
            // If we're editing this redirect, cancel the edit
            if (editingSlug === slug) {
              handleCancelEdit()
            }
          } else {
            const result = await response.json()
            showError('Error', result.error || 'Failed to delete redirect')
          }
        } catch (error) {
          console.error('Error deleting redirect:', error)
          showError('Error', 'Failed to delete redirect. Please try again.')
        }
      },
      undefined,
      'Delete',
      'Cancel'
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Copied!', 'URL copied to clipboard')
    } catch (err) {
      showError('Error', 'Failed to copy URL')
    }
  }

  const downloadSitemap = () => {
    window.open('/sitemap.xml', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      <SimpleHeader />
      
      <main className="flex-grow flex">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h1>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {editingSlug ? 'Edit Redirect' : 'Create Redirect'}
              </button>
              
              <button
                onClick={() => setActiveTab('manage')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'manage'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Redirects
                <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {Object.keys(redirects).length}
                </span>
              </button>
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={downloadSitemap}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Sitemap
                </button>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Robots.txt
                </a>
                <a
                  href="/"
                  className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'create' && (
            <div className="max-w-4xl">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {editingSlug ? 'Edit Redirect' : 'Create New Redirect'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {editingSlug ? `Editing: /${editingSlug}` : 'Create SEO-optimized redirections with custom meta tags'}
                    </p>
                  </div>
                  {editingSlug && (
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Create/Edit Form */}
              <div className="card">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Enter page title"
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
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="https://example.com/your-page"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        id="desc"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Enter page description for SEO"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="input-field"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
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
                          className="input-field"
                          placeholder="Your Site Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="keywords"
                          name="keywords"
                          value={formData.keywords}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="seo, marketing, website"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                          Content Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="input-field"
                        >
                          <option value="website">Website</option>
                          <option value="article">Article</option>
                          <option value="blog">Blog Post</option>
                          <option value="product">Product</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Slug {editingSlug ? '' : '(optional)'}
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="custom-url-slug"
                        disabled={!!editingSlug}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {editingSlug 
                          ? 'Slug cannot be changed when editing'
                          : `If empty, will be auto-generated from title: ${formData.title ? generateSlug(formData.title) : 'your-title-here'}`
                        }
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                        editingSlug ? 'Update Redirect' : 'Create Redirect'
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Generated URLs */}
              {generatedUrls && (
                <div className="card mt-8">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Generated URLs</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short URL (SEO-friendly)</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={generatedUrls.short}
                            readOnly
                            className="input-field rounded-r-none flex-1"
                          />
                          <button
                            onClick={() => copyToClipboard(generatedUrls.short)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Long URL (with parameters)</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={generatedUrls.long}
                            readOnly
                            className="input-field rounded-r-none flex-1"
                          />
                          <button
                            onClick={() => copyToClipboard(generatedUrls.long)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="max-w-6xl">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Manage Redirects</h2>
                <p className="text-gray-600 mt-2">
                  View, edit, and delete your existing redirects
                </p>
              </div>

              {/* Redirects List */}
              <div className="card">
                <div className="p-8">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading redirects...</p>
                    </div>
                  ) : Object.keys(redirects).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No redirects yet</h4>
                      <p className="text-gray-600 mb-4">Create your first redirect to get started.</p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="btn-primary"
                      >
                        Create First Redirect
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(redirects).map(([slug, data]) => (
                        <div key={slug} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="font-semibold text-gray-900 text-lg">{data.title}</h4>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                  {data.type}
                                </span>
                                {editingSlug === slug && (
                                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                                    Editing
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{data.desc}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">/{slug}</span>
                                {data.site_name && <span>• {data.site_name}</span>}
                                {data.keywords && <span>• {data.keywords.split(',').length} keywords</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-6">
                              <a
                                href={`/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Preview redirect"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Preview
                              </a>
                              <button
                                onClick={() => handleEdit(slug)}
                                className="flex items-center px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit redirect"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(slug)}
                                className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete redirect"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SimpleFooter />
    </div>
  )
}