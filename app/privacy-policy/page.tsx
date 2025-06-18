import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SEO Redirects Pro',
  description: 'Learn how SEO Redirects Pro collects, uses, and protects your personal information. Our comprehensive privacy policy ensures transparency and data protection.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025"

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h2>
            <p className="text-blue-800 text-sm">
              We collect minimal data necessary to provide our SEO redirect services. We don't sell your data, 
              and we use industry-standard security measures to protect your information.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Redirect Data:</strong> Titles, descriptions, URLs, keywords, and images you submit when creating redirects</li>
              <li><strong>Contact Information:</strong> Email address if you contact us for support</li>
              <li><strong>Usage Data:</strong> How you interact with our service to improve functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Analytics Data:</strong> Page views, click-through rates, and redirect performance via Google Analytics</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and access times</li>
              <li><strong>Cookies:</strong> Essential cookies for site functionality and analytics cookies (with consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Provision:</strong> Create and manage your SEO redirects</li>
              <li><strong>Performance Optimization:</strong> Generate sitemaps and optimize for search engines</li>
              <li><strong>Analytics:</strong> Understand usage patterns to improve our service</li>
              <li><strong>Communication:</strong> Respond to support requests and provide service updates</li>
              <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (Google Analytics, hosting providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> Data transmission is encrypted using SSL/TLS</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Regular Updates:</strong> Security systems are regularly updated and monitored</li>
              <li><strong>Secure Hosting:</strong> Data is hosted on secure, enterprise-grade infrastructure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
            <p className="mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Opt-out:</strong> Opt out of non-essential cookies and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies to enhance your experience:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Google Analytics to understand site usage (can be disabled)</li>
              <li><strong>Performance Cookies:</strong> Help us optimize site performance</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              You can control cookies through your browser settings or our cookie consent banner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to provide our services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Redirect Data:</strong> Retained while your redirects are active</li>
              <li><strong>Analytics Data:</strong> Retained for up to 26 months (Google Analytics default)</li>
              <li><strong>Support Communications:</strong> Retained for 2 years for quality assurance</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Our services are hosted on secure cloud infrastructure. If you're located outside the hosting region, 
              your data may be transferred internationally. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes by 
              posting the new policy on this page and updating the "Last updated" date. Your continued use of our 
              service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="mb-2"><strong>Email:</strong> privacy@seoredirects.com</p>
              <p className="mb-2"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
              <p className="text-sm text-gray-600">
                For urgent privacy concerns, please mark your email as "URGENT - Privacy Request"
              </p>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Your Privacy Matters</h3>
            <p className="text-green-800 text-sm">
              We're committed to protecting your privacy and being transparent about our data practices. 
              If you have any concerns or questions, please don't hesitate to reach out to us.
            </p>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  )
}