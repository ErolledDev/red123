'use client'

/**
 * Utility functions for text processing and meta tag generation
 */

/**
 * Strips HTML tags and markdown formatting from text to create clean meta descriptions
 */
export function stripHtmlForMeta(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/#{1,6}\s+/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/^[-*+]\s+/gm, '') // List items
    .replace(/^\d+\.\s+/gm, '') // Numbered lists
    
    // Remove HTML tags
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(p|div|h[1-6]|li|ul|ol)[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Truncates text to a specific length for meta descriptions
 */
export function truncateForMeta(text: string, maxLength: number = 160): string {
  const cleaned = stripHtmlForMeta(text)
  if (cleaned.length <= maxLength) return cleaned
  
  // Find the last complete word within the limit
  const truncated = cleaned.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Converts markdown to display HTML for rendering
 */
export function formatMarkdownForDisplay(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h1>')
    
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Lists - Process line by line to handle properly
    .split('\n')
    .map(line => {
      // Unordered lists
      if (line.match(/^[-*+]\s+/)) {
        return `<li class="ml-4 mb-1">• ${line.replace(/^[-*+]\s+/, '')}</li>`
      }
      // Ordered lists
      if (line.match(/^\d+\.\s+/)) {
        return `<li class="ml-4 mb-1 list-decimal">${line.replace(/^\d+\.\s+/, '')}</li>`
      }
      return line
    })
    .join('\n')
    
    // Wrap consecutive list items
    .replace(/((<li class="ml-4 mb-1">• .*?<\/li>\n?)+)/g, '<ul class="list-none space-y-1 mb-4">$1</ul>')
    .replace(/((<li class="ml-4 mb-1 list-decimal">.*?<\/li>\n?)+)/g, '<ol class="list-decimal list-inside space-y-1 mb-4 ml-4">$1</ol>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraph if not already wrapped
    .replace(/^(?!<[h1-6]|<ul|<ol|<p)(.+)/gm, '<p class="mb-4">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p class="mb-4"><\/p>/g, '')
}

/**
 * Extracts keywords from markdown content
 */
export function extractKeywordsFromMarkdown(markdown: string, existingKeywords: string = ''): string {
  const cleaned = stripHtmlForMeta(markdown)
  const words = cleaned.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'would', 'there'].includes(word))
  
  // Get word frequency
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // Sort by frequency and take top words
  const topWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
  
  // Combine with existing keywords
  const existing = existingKeywords.split(',').map(k => k.trim()).filter(k => k)
  const combined = existing.concat(topWords)
  
  // Remove duplicates using Array.from and Set
  const unique = Array.from(new Set(combined))
  
  return unique.slice(0, 10).join(', ')
}