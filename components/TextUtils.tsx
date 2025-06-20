'use client'

/**
 * Utility functions for text processing and meta tag generation
 */

/**
 * Strips HTML tags and formatting from rich text to create clean meta descriptions
 */
export function stripHtmlForMeta(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(p|div|h[1-6]|li|ul|ol)[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
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
 * Converts rich text to display HTML for rendering
 */
export function formatRichTextForDisplay(text: string): string {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
}

/**
 * Extracts keywords from rich text content
 */
export function extractKeywordsFromRichText(text: string, existingKeywords: string = ''): string {
  const cleaned = stripHtmlForMeta(text)
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
  const combined = [...existing, ...topWords]
  const unique = [...new Set(combined)]
  
  return unique.slice(0, 10).join(', ')
}