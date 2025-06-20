'use client'

import { useState, useEffect } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  className?: string
}

export default function VideoPlayer({ videoUrl, title, className = '' }: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'tiktok' | 'dailymotion' | 'direct' | 'unknown'>('unknown')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!videoUrl) {
      setIsLoading(false)
      return
    }

    try {
      const url = new URL(videoUrl)
      let processedUrl = ''
      let type: typeof videoType = 'unknown'

      // YouTube
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        type = 'youtube'
        let videoId = ''
        
        if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.slice(1)
        } else if (url.searchParams.get('v')) {
          videoId = url.searchParams.get('v') || ''
        }
        
        if (videoId) {
          processedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
        }
      }
      
      // Vimeo
      else if (url.hostname.includes('vimeo.com')) {
        type = 'vimeo'
        const videoId = url.pathname.split('/').pop()
        if (videoId) {
          processedUrl = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
        }
      }
      
      // TikTok
      else if (url.hostname.includes('tiktok.com')) {
        type = 'tiktok'
        // TikTok embed is more complex, we'll show a link instead
        processedUrl = videoUrl
      }
      
      // Dailymotion
      else if (url.hostname.includes('dailymotion.com')) {
        type = 'dailymotion'
        const videoId = url.pathname.split('/').pop()?.split('_')[0]
        if (videoId) {
          processedUrl = `https://www.dailymotion.com/embed/video/${videoId}`
        }
      }
      
      // Direct video files
      else if (videoUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i)) {
        type = 'direct'
        processedUrl = videoUrl
      }
      
      // Unknown/unsupported
      else {
        type = 'unknown'
        processedUrl = videoUrl
      }

      setVideoType(type)
      setEmbedUrl(processedUrl)
      setIsLoading(false)
    } catch (err) {
      setError('Invalid video URL')
      setIsLoading(false)
    }
  }, [videoUrl])

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !embedUrl) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 mb-4">{error || 'Unable to load video'}</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Video
          </a>
        </div>
      </div>
    )
  }

  // Render based on video type
  switch (videoType) {
    case 'youtube':
    case 'vimeo':
    case 'dailymotion':
      return (
        <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )

    case 'direct':
      return (
        <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
          <video
            controls
            className="w-full h-full"
            preload="metadata"
            poster=""
          >
            <source src={embedUrl} type="video/mp4" />
            <source src={embedUrl} type="video/webm" />
            <source src={embedUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      )

    case 'tiktok':
      return (
        <div className={`bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center ${className}`}>
          <div className="text-center p-8">
            <svg className="w-16 h-16 text-pink-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TikTok Video</h3>
            <p className="text-gray-600 mb-4">Click to view on TikTok</p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Watch on TikTok
            </a>
          </div>
        </div>
      )

    default:
      return (
        <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
          <div className="text-center p-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <p className="text-gray-600 mb-4">Unsupported video format</p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Link
            </a>
          </div>
        </div>
      )
  }
}