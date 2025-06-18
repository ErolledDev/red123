import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | SEO Redirects Pro',
  description: 'Important disclaimers about SEO Redirects Pro services, including limitations, warranties, and user responsibilities for SEO and marketing activities.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function DisclaimerPage() {
  const lastUpdated = "January 15, 2025"

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-xl text-gray-600">
              Important information about the limitations and scope of our SEO redirect services.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important Notice</h2>
            <p className="text-yellow-800 text-sm">
              This disclaimer outlines the limitations of our service and your responsibilities as a user. 
              Please read carefully before using SEO Redirects Pro.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Disclaimer</h2>
            <p className="mb-4">
              The information and services provided by SEO Redirects Pro are offered on an "as is" basis. 
              While we strive to provide accurate and reliable services, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or 
              availability of our services.
            </p>
            <p className="mb-4">
              Your use of our service is at your own risk. We shall not be liable for any loss or damage 
              arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. SEO Results Disclaimer</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">No Guaranteed Results</h3>
              <p className="text-blue-800 text-sm">
                SEO results vary significantly based on many factors beyond our control. We cannot guarantee 
                specific rankings, traffic increases, or business outcomes.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Factors Affecting SEO Performance</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Search Engine Algorithms:</strong> Constantly changing and beyond our control</li>
              <li><strong>Competition:</strong> Other websites competing for the same keywords</li>
              <li><strong>Content Quality:</strong> The quality and relevance of your target content</li>
              <li><strong>Website Authority:</strong> Your domain's existing authority and trust signals</li>
              <li><strong>Market Conditions:</strong> Industry trends and seasonal variations</li>
              <li><strong>Technical Factors:</strong> Website speed, mobile-friendliness, and other technical SEO factors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">What We Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>SEO-optimized redirect pages with proper meta tags</li>
              <li>Automatic sitemap generation and submission</li>
              <li>Clean, search engine-friendly URLs</li>
              <li>Best practices implementation for indexing</li>
              <li>Analytics and performance tracking tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Services</h2>
            <p className="mb-4">
              Our service integrates with various third-party platforms and services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Google Search Console and Analytics</li>
              <li>Bing Webmaster Tools</li>
              <li>Social media platforms</li>
              <li>Hosting and infrastructure providers</li>
            </ul>
            <p className="mb-4">
              We are not responsible for the availability, functionality, or policies of these third-party services. 
              Changes to third-party services may affect our service functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content and Legal Compliance</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">User Responsibility</h3>
            <p className="mb-4">You are solely responsible for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Ensuring all content you submit is legal and compliant with applicable laws</li>
              <li>Obtaining necessary permissions for any copyrighted material</li>
              <li>Complying with advertising standards and regulations</li>
              <li>Following platform-specific terms of service for target websites</li>
              <li>Ensuring your marketing practices are ethical and legal</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Monitoring</h3>
            <p className="mb-4">
              While we may monitor content for obvious violations, we do not review all user-generated content. 
              We are not responsible for the accuracy, legality, or appropriateness of user-submitted content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Technical Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We strive for high uptime but cannot guarantee 100% availability</li>
              <li>Maintenance windows may temporarily affect service access</li>
              <li>Third-party dependencies may cause service interruptions</li>
              <li>Internet connectivity issues may affect service performance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data and Analytics</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics data may have delays or inaccuracies</li>
              <li>Third-party analytics services may change their methodologies</li>
              <li>Data retention periods may vary based on technical constraints</li>
              <li>Historical data may not be available indefinitely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Financial and Business Disclaimers</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Business Advice</h3>
            <p className="mb-4">
              Our service provides technical SEO tools, not business or financial advice. Any suggestions or 
              recommendations are for informational purposes only and should not be considered professional advice.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Revenue and ROI</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We make no guarantees about revenue generation or return on investment</li>
              <li>Business success depends on many factors beyond SEO</li>
              <li>Past performance does not guarantee future results</li>
              <li>Market conditions can significantly impact outcomes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Compliance and Regulatory Matters</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Advertising Regulations</h3>
            <p className="mb-4">
              Users must comply with all applicable advertising regulations, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>FTC guidelines for endorsements and testimonials</li>
              <li>GDPR and other privacy regulations</li>
              <li>CAN-SPAM Act and email marketing laws</li>
              <li>Platform-specific advertising policies</li>
              <li>Industry-specific regulations (finance, healthcare, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">International Use</h3>
            <p className="mb-4">
              Our service may be used internationally, but users are responsible for compliance with local laws 
              and regulations in their jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Warranties</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <p className="text-red-800 text-sm font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
              </p>
            </div>
            <p className="mb-4">We specifically disclaim:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or completeness of information</li>
              <li>Warranties about specific SEO results or outcomes</li>
              <li>Warranties regarding third-party services or integrations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Updates and Changes</h2>
            <p className="mb-4">
              This disclaimer may be updated from time to time to reflect changes in our services, legal requirements, 
              or industry best practices. We will notify users of material changes when possible.
            </p>
            <p className="mb-4">
              Continued use of our service after changes to this disclaimer constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="mb-4">
              If you have questions about this disclaimer or need clarification about our services, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="mb-2"><strong>Email:</strong> support@seoredirects.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> "Disclaimer Inquiry"</p>
              <p className="mb-2"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
              <p className="text-sm text-gray-600">
                Please be specific about which aspect of the disclaimer you're asking about
              </p>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Use Our Service Responsibly</h3>
            <p className="text-blue-800 text-sm">
              We're committed to providing excellent SEO tools while being transparent about limitations and responsibilities. 
              Please use our service ethically and in compliance with all applicable laws and regulations.
            </p>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  )
}