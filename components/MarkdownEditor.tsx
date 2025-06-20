'use client'

import { useState, useRef, useEffect } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function MarkdownEditor({ value, onChange, placeholder, className = '' }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Convert markdown to HTML for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      
      // Line breaks
      .replace(/\n/g, '<br>')
      
      // Wrap list items in ul tags
      .replace(/(<li class="ml-4">• .*?<\/li>)/g, '<ul class="list-none space-y-1 mb-4">$1</ul>')
      .replace(/(<li class="ml-4 list-decimal">.*?<\/li>)/g, '<ol class="list-decimal list-inside space-y-1 mb-4 ml-4">$1</ol>')
  }

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = before + selectedText + after

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    // Set cursor position after insertion
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + before.length + selectedText.length + after.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      insertMarkdown('  ')
    }
    
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertMarkdown('**', '**')
          break
        case 'i':
          e.preventDefault()
          insertMarkdown('*', '*')
          break
        case 'k':
          e.preventDefault()
          insertMarkdown('[', '](url)')
          break
      }
    }
  }

  if (!mounted) {
    return (
      <div className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 ${className}`}>
        <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className={`border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex bg-white rounded border border-gray-200">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 text-sm rounded-l transition-colors ${
                !isPreview 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 text-sm rounded-r transition-colors ${
                isPreview 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Preview
            </button>
          </div>

          <div className="w-px bg-gray-300 h-6"></div>

          {/* Formatting Buttons */}
          {!isPreview && (
            <>
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-2 hover:bg-gray-200 rounded text-sm font-bold transition-colors"
                title="Bold (Ctrl+B)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-2 hover:bg-gray-200 rounded text-sm italic transition-colors"
                title="Italic (Ctrl+I)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l4 16M6 8h12M4 16h12" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="p-2 hover:bg-gray-200 rounded text-sm font-mono transition-colors"
                title="Code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](url)')}
                className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
                title="Link (Ctrl+K)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              
              <div className="w-px bg-gray-300 h-6"></div>
              
              <button
                type="button"
                onClick={() => insertMarkdown('- ', '')}
                className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
                title="Bullet List"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('1. ', '')}
                className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
                title="Numbered List"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="w-px bg-gray-300 h-6"></div>
              
              <button
                type="button"
                onClick={() => insertMarkdown('# ', '')}
                className="p-2 hover:bg-gray-200 rounded text-sm font-bold transition-colors"
                title="Heading 1"
              >
                H1
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('## ', '')}
                className="p-2 hover:bg-gray-200 rounded text-sm font-bold transition-colors"
                title="Heading 2"
              >
                H2
              </button>
              
              <button
                type="button"
                onClick={() => insertMarkdown('### ', '')}
                className="p-2 hover:bg-gray-200 rounded text-sm font-bold transition-colors"
                title="Heading 3"
              >
                H3
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Editor/Preview */}
      {isPreview ? (
        <div className="w-full px-4 py-3 min-h-[120px] prose prose-sm max-w-none">
          {value ? (
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
            />
          ) : (
            <div className="text-gray-400 italic">Nothing to preview yet...</div>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Write your description using Markdown...'}
          className="w-full px-4 py-3 min-h-[120px] focus:outline-none resize-none font-mono text-sm"
          style={{ 
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        />
      )}
      
      {/* Helper Text */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <p className="text-xs text-gray-500">
          <strong>Markdown supported:</strong> **bold**, *italic*, `code`, [links](url), # headers, - lists. 
          Use <strong>Ctrl+B</strong> (bold), <strong>Ctrl+I</strong> (italic), <strong>Ctrl+K</strong> (link)
        </p>
      </div>
    </div>
  )
}