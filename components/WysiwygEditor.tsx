'use client'

import { useState, useRef, useEffect } from 'react'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function WysiwygEditor({ value, onChange, placeholder, className = '' }: WysiwygEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Convert plain text to HTML and vice versa
  const textToHtml = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
  }

  const htmlToText = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  }

  useEffect(() => {
    if (mounted) {
      setHtmlContent(textToHtml(value))
    }
  }, [value, mounted])

  const handleFocus = () => {
    setIsEditing(true)
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      const newText = htmlToText(newHtml)
      setHtmlContent(newHtml)
      onChange(newText)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      setHtmlContent(newHtml)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
      handleInput()
    }
  }

  const insertText = (before: string, after: string = '') => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      const newText = before + selectedText + after
      
      range.deleteContents()
      range.insertNode(document.createTextNode(newText))
      
      // Move cursor to end of inserted text
      range.setStartAfter(range.endContainer)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      
      handleInput()
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
      {isEditing && (
        <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => execCommand('bold')}
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
              onClick={() => execCommand('italic')}
              className="p-2 hover:bg-gray-200 rounded text-sm italic transition-colors"
              title="Italic (Ctrl+I)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l4 16M6 8h12M4 16h12" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-2 hover:bg-gray-200 rounded text-sm underline transition-colors"
              title="Underline (Ctrl+U)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v8a5 5 0 0010 0V4M5 20h14" />
              </svg>
            </button>
            
            <div className="w-px bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="w-px bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => execCommand('removeFormat')}
              className="p-2 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Clear Formatting"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        className="w-full px-4 py-3 min-h-[100px] focus:outline-none resize-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        dangerouslySetInnerHTML={!isEditing ? { __html: htmlContent || `<span class="text-gray-400">${placeholder || 'Enter description...'}</span>` } : undefined}
        suppressContentEditableWarning={true}
      />
      
      {/* Helper Text */}
      {isEditing && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-xs text-gray-500">
            Use the toolbar above or keyboard shortcuts: <strong>Ctrl+B</strong> (bold), <strong>Ctrl+I</strong> (italic), <strong>Ctrl+U</strong> (underline)
          </p>
        </div>
      )}
    </div>
  )
}