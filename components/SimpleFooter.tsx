'use client'

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; {currentYear} SEO Redirects. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}