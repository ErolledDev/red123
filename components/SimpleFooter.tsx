'use client'

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  SEO Redirects Pro
                </h3>
                <p className="text-sm text-gray-400">Instant Google Indexing</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Create SEO-optimized redirects that get indexed by search engines in 24 hours. 
              Boost your organic traffic and dominate search results.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Admin Panel
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Live Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Features</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>⚡ Lightning Fast Indexing</li>
              <li>🔗 Premium Backlinks</li>
              <li>📊 Analytics Ready</li>
              <li>📱 Mobile Optimized</li>
              <li>🛡️ Enterprise Security</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 sm:mb-0">
              <p>&copy; {currentYear} SEO Redirects Pro. Built for search engine domination.</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/sitemap.xml" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                Sitemap
              </a>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Made with ❤️ for SEO</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}