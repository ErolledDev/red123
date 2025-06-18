import SimpleHeader from '../../components/SimpleHeader'
import SimpleFooter from '../../components/SimpleFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SEO Redirects Pro',
  description: 'Read our terms of service to understand the rules and guidelines for using SEO Redirects Pro. Learn about user responsibilities, service limitations, and legal agreements.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025"

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using our SEO redirect services.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Agreement Overview</h2>
            <p className="text-blue-800 text-sm">
              By using SEO Redirects Pro, you agree to these terms. Our service helps you create SEO-optimized 
              redirects for legitimate marketing and content promotion purposes.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using SEO Redirects Pro ("the Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="mb-4">
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="mb-4">SEO Redirects Pro provides:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SEO-optimized URL redirection services</li>
              <li>Automatic sitemap generation and search engine submission</li>
              <li>Meta tag optimization for social media and search engines</li>
              <li>Analytics and performance tracking</li>
              <li>Admin tools for managing redirects</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Responsibilities</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Security</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must not share your account credentials with others</li>
              <li>You must notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Acceptable Use</h3>
            <p className="mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create redirects to illegal, harmful, or malicious content</li>
              <li>Use the Service for spam, phishing, or deceptive practices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service to distribute malware or viruses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You retain ownership of content you submit to create redirects</li>
              <li>You grant us a license to use your content to provide the Service</li>
              <li>You represent that you have the right to use all submitted content</li>
              <li>You are responsible for ensuring your content doesn't violate third-party rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Intellectual Property</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Service and its original content are owned by SEO Redirects Pro</li>
              <li>Our trademarks, logos, and service marks are protected</li>
              <li>You may not use our intellectual property without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Availability and Modifications</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>We are not liable for temporary service interruptions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Modifications</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may modify or discontinue features with reasonable notice</li>
              <li>We may update these Terms from time to time</li>
              <li>Continued use after changes constitutes acceptance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>, 
              which is incorporated into these Terms by reference.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We collect minimal data necessary to provide the Service</li>
              <li>We use industry-standard security measures</li>
              <li>We do not sell your personal information</li>
              <li>You have rights regarding your personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <p className="text-yellow-800 text-sm font-medium">
                IMPORTANT: Please read this section carefully as it limits our liability.
              </p>
            </div>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEO REDIRECTS PRO SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from third-party content or services</li>
              <li>Any damages exceeding the amount paid for the Service in the past 12 months</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless SEO Redirects Pro from any claims, damages, or expenses 
              (including reasonable attorney fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you submit through the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by You</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You may stop using the Service at any time</li>
              <li>You may request deletion of your data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by Us</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may terminate or suspend access for violations of these Terms</li>
              <li>We may terminate with notice for business reasons</li>
              <li>We will provide reasonable notice when possible</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Dispute Resolution Process</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Direct Communication:</strong> Contact us first to resolve disputes informally</li>
              <li><strong>Mediation:</strong> If informal resolution fails, we prefer mediation</li>
              <li><strong>Arbitration:</strong> Binding arbitration for disputes that cannot be resolved otherwise</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Entire Agreement</h3>
            <p className="mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              SEO Redirects Pro regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Severability</h3>
            <p className="mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Waiver</h3>
            <p className="mb-4">
              No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="mb-2"><strong>Email:</strong> legal@seoredirects.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> "Terms of Service Inquiry"</p>
              <p className="mb-2"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
              <p className="text-sm text-gray-600">
                For urgent legal matters, please mark your email as "URGENT - Legal Matter"
              </p>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Thank You for Using Our Service</h3>
            <p className="text-green-800 text-sm">
              We appreciate your business and are committed to providing excellent SEO redirect services. 
              These terms help ensure a positive experience for all users.
            </p>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  )
}