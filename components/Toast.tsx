'use client'

import { useEffect, useState } from 'react'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info' | 'warning' | 'confirm'
  title: string
  message?: string
  duration?: number
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-dismiss for non-confirmation toasts
    let dismissTimer: NodeJS.Timeout
    if (toast.type !== 'confirm' && toast.duration !== 0) {
      const duration = toast.duration || 3000
      dismissTimer = setTimeout(() => {
        handleDismiss()
      }, duration)
    }

    return () => {
      clearTimeout(timer)
      if (dismissTimer) clearTimeout(dismissTimer)
    }
  }, [toast.duration, toast.type])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 300)
  }

  const handleConfirm = () => {
    if (toast.onConfirm) {
      toast.onConfirm()
    }
    handleDismiss()
  }

  const handleCancel = () => {
    if (toast.onCancel) {
      toast.onCancel()
    }
    handleDismiss()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (toast.type === 'confirm') {
        handleCancel()
      } else {
        handleDismiss()
      }
    } else if (e.key === 'Enter' && toast.type === 'confirm') {
      handleConfirm()
    }
  }

  const getToastStyles = () => {
    const baseStyles = "relative p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md"
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`
      case 'confirm':
        return `${baseStyles} bg-orange-50 border-orange-500 text-orange-800`
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`
    }
  }

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0"
    
    switch (toast.type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'info':
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'confirm':
        return (
          <svg className={`${iconClass} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-labelledby={`toast-title-${toast.id}`}
      aria-describedby={toast.message ? `toast-message-${toast.id}` : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={toast.type === 'confirm' ? 0 : -1}
    >
      <div className={getToastStyles()}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <h4 id={`toast-title-${toast.id}`} className="font-semibold text-sm">
              {toast.title}
            </h4>
            {toast.message && (
              <p id={`toast-message-${toast.id}`} className="text-sm mt-1 opacity-90">
                {toast.message}
              </p>
            )}
            
            {toast.type === 'confirm' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleConfirm}
                  className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors"
                  aria-label={`Confirm: ${toast.title}`}
                >
                  {toast.confirmText || 'Confirm'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
                  aria-label={`Cancel: ${toast.title}`}
                >
                  {toast.cancelText || 'Cancel'}
                </button>
              </div>
            )}
          </div>
          
          {toast.type !== 'confirm' && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}