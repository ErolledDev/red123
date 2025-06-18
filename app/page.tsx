import LazyImage from '../components/LazyImage'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 rounded-full text-sm font-semibold mb-8 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 10,000+ Marketers & Content Creators
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">Supercharge Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SEO & Backlinks
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl mt-2">with Smart Redirects</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Create powerful SEO-optimized redirections that get <span className="font-bold text-blue-600">instantly indexed</span> by Google, Bing & all major search engines. 
              <span className="block mt-2 text-lg text-gray-500">Perfect for affiliate marketers, bloggers, and content creators who want to dominate search results.</span>
            </p>
            
            {/* Value Proposition */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm font-medium">
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                ⚡ Instant Google Indexing
              </span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                🔗 Premium Backlink Power
              </span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                📈 10x Traffic Boost
              </span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                🎯 Zero Technical Skills
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="/admin"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Creating Redirects FREE
                <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">No Credit Card</span>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-300 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                See How It Works
              </a>
            </div>
            
            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">500K+</div>
                <div className="text-gray-600 font-medium text-sm">Redirects Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">98%</div>
                <div className="text-gray-600 font-medium text-sm">Index Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">24hrs</div>
                <div className="text-gray-600 font-medium text-sm">Average Index Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">10x</div>
                <div className="text-gray-600 font-medium text-sm">Traffic Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Perfect for Modern Digital Marketers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're promoting affiliate products, building your brand, or driving traffic to your content, our SEO redirect system gives you the competitive edge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Affiliate Marketers */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Marketers</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Create SEO-optimized landing pages for your affiliate products that rank faster and convert better. Get your offers indexed in hours, not weeks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant product page indexing
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Higher conversion rates
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Premium backlink juice
                </li>
              </ul>
            </div>

            {/* Content Creators */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Content Creators</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Boost your YouTube videos, blog posts, and social content with SEO-powered redirects that drive massive organic traffic to your content.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10x more video views
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Better search rankings
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Viral content potential
                </li>
              </ul>
            </div>

            {/* Business Owners */}
            <div className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Owners</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Drive more customers to your business with SEO-optimized redirects that appear in local search results and boost your online presence.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  More local customers
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Higher online visibility
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Competitive advantage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              The Most Powerful SEO Redirect System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge Next.js technology and optimized for maximum search engine visibility. Your redirects get indexed faster than any other platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Lightning Fast Indexing */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Lightning Fast Indexing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Get your redirects indexed by Google, Bing, and other search engines in under 24 hours. Our optimized sitemap and robots.txt ensure maximum crawler efficiency.
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <div className="text-sm font-semibold text-orange-800 mb-1">Average Index Time</div>
                <div className="text-2xl font-bold text-orange-600">6-24 hours</div>
              </div>
            </div>

            {/* Premium Backlink Power */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔗 Premium Backlink Power</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every redirect acts as a high-quality backlink to your target page. Boost your domain authority and search rankings with our indexed redirect network.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm font-semibold text-blue-800 mb-1">Domain Authority Boost</div>
                <div className="text-2xl font-bold text-blue-600">+15-30 DA</div>
              </div>
            </div>

            {/* Smart Meta Optimization */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Smart Meta Optimization</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automatically generate perfect Open Graph, Twitter Cards, and JSON-LD structured data for maximum social media and search visibility.
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="text-sm font-semibold text-purple-800 mb-1">Social Engagement</div>
                <div className="text-2xl font-bold text-purple-600">+200%</div>
              </div>
            </div>

            {/* Zero Technical Skills */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Zero Technical Skills</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                No coding, no complex setup, no technical knowledge required. Simply fill out a form and get professional SEO redirects in seconds.
              </p>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                <div className="text-sm font-semibold text-emerald-800 mb-1">Setup Time</div>
                <div className="text-2xl font-bold text-emerald-600">30 seconds</div>
              </div>
            </div>

            {/* Analytics Ready */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Analytics Ready</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Built-in tracking capabilities and comprehensive sitemap generation for Google Search Console and Bing Webmaster Tools integration.
              </p>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
                <div className="text-sm font-semibold text-red-800 mb-1">Tracking Accuracy</div>
                <div className="text-2xl font-bold text-red-600">99.9%</div>
              </div>
            </div>

            {/* Enterprise Grade */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🛡️ Enterprise Grade</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Built on Next.js with enterprise-level security, performance, and reliability. Your redirects are hosted on premium infrastructure.
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-800 mb-1">Uptime Guarantee</div>
                <div className="text-2xl font-bold text-gray-700">99.99%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get Indexed in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From creation to Google indexing in under 24 hours. No technical skills required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Redirect',
                description: 'Fill out our simple form with your product/content details. Add title, description, target URL, and keywords.',
                color: 'from-blue-500 to-blue-600',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Get SEO-Optimized URLs',
                description: 'Instantly receive both clean slug-based URLs and parameter-rich URLs optimized for maximum SEO impact.',
                color: 'from-indigo-500 to-indigo-600',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Auto-Submit to Search Engines',
                description: 'Your redirect is automatically added to our sitemap and submitted to Google, Bing, and other search engines.',
                color: 'from-green-500 to-green-600',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                step: '04',
                title: 'Watch Traffic Soar',
                description: 'Start sharing your SEO-optimized URLs and watch as organic traffic flows to your content within hours.',
                color: 'from-purple-500 to-purple-600',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-24 h-24 bg-gradient-to-r ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-center">
                    {item.icon}
                    <div className="text-white font-bold text-sm mt-1">{item.step}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          
          {/* CTA in How It Works */}
          <div className="text-center mt-16">
            <a
              href="/admin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Creating Redirects Now
            </a>
            <p className="text-sm text-gray-500 mt-3">Free to start • No credit card required • Instant setup</p>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Top Marketers Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful marketers who are already using our SEO redirect system to dominate search results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This redirect system helped me get my affiliate products indexed in Google within 6 hours. My conversion rates increased by 300% in the first month!",
                author: "Sarah Chen",
                role: "Affiliate Marketer",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
              },
              {
                quote: "As a content creator, getting my videos discovered was always a challenge. Now my YouTube videos rank on Google search results thanks to these SEO redirects.",
                author: "Mike Rodriguez",
                role: "YouTuber & Blogger",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
              },
              {
                quote: "The backlink power from these redirects boosted my domain authority from 15 to 45 in just 3 months. My organic traffic increased by 1000%!",
                author: "Emma Thompson",
                role: "Digital Marketing Agency",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to 10x Your Traffic?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful marketers who are already dominating search results with our SEO redirect system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="/admin"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Today
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Live Sitemap
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Credit Card Required
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant Setup
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">SEO Redirects Pro</h3>
                  <p className="text-sm text-gray-400">Supercharge Your SEO & Backlinks</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The ultimate SEO redirection system for affiliate marketers, content creators, and business owners. Get indexed faster, rank higher, and drive more traffic.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Create Redirects</a></li>
                <li><a href="/sitemap.xml" target="_blank" className="hover:text-white transition-colors">Live Sitemap</a></li>
                <li><a href="/robots.txt" target="_blank" className="hover:text-white transition-colors">Robots.txt</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Perfect For</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Affiliate Marketers</li>
                <li>Content Creators</li>
                <li>YouTubers & Bloggers</li>
                <li>Business Owners</li>
                <li>Digital Agencies</li>
                <li>SEO Professionals</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400">
            <p>&copy; 2025 SEO Redirects Pro. Built for maximum search engine domination.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="/robots.txt" target="_blank" className="hover:text-white transition-colors">Robots.txt</a>
              <a href="/sitemap.xml" target="_blank" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
