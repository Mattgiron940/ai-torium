import { Metadata } from 'next'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Terms of Service - AI-TORIUM',
  description: 'AI-TORIUM Terms of Service and usage agreement',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI-TORIUM</h1>
                <p className="text-xs text-gray-600">Smart Learning</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using AI-TORIUM, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Description of Service</h2>
            <p className="text-gray-600 mb-4">
              AI-TORIUM is an AI-powered educational platform that provides tutoring, 
              explanations, and learning assistance across various subjects.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Accounts</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>One person or legal entity may not maintain more than one free account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Use the service for any unlawful purposes</li>
              <li>Submit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated tools to access the service without permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Academic Integrity</h2>
            <p className="text-gray-600 mb-4">
              AI-TORIUM is designed to help you learn and understand concepts. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Use our service as a learning aid, not for cheating</li>
              <li>Follow your institution's academic integrity policies</li>
              <li>Not submit AI-generated content as your own work</li>
              <li>Use explanations to understand concepts, not copy answers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Subscription and Payment</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Paid subscriptions automatically renew unless canceled</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>Price changes will be communicated 30 days in advance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The AI-TORIUM platform, including its content, features, and functionality, 
              is owned by us and protected by copyright, trademark, and other laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              AI-TORIUM provides educational assistance but cannot guarantee the accuracy 
              of all responses. We are not liable for any academic or professional 
              consequences of using our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account at our discretion, with or without 
              notice, for conduct that we believe violates these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. We will notify users 
              of significant changes via email or platform notification.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: legal@ai-torium.com<br />
              Address: San Francisco, CA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}