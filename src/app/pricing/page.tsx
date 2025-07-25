import { Metadata } from 'next'
import Link from 'next/link'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Pricing - AI-TORIUM',
  description: 'Choose the perfect plan for your learning journey with AI-TORIUM',
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI-TORIUM',
    features: [
      '5 questions per day',
      'Basic AI explanations',
      'Text-only questions',
      'Community support',
      'Basic progress tracking'
    ],
    limitations: [
      'No image uploads',
      'No priority support',
      'No advanced features'
    ],
    buttonText: 'Get Started Free',
    buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'per month',
    description: 'Most popular for serious learners',
    features: [
      'Unlimited questions',
      'Advanced AI tutoring',
      'Image & OCR uploads',
      'Priority support',
      'Detailed analytics',
      'Study session tracking',
      'Achievement badges',
      'Learning paths'
    ],
    limitations: [],
    buttonText: 'Start Premium Trial',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$39.99',
    period: 'per month',
    description: 'For power users and professionals',
    features: [
      'Everything in Premium',
      'Voice interactions',
      'API access',
      'Expert tutor sessions',
      'Advanced analytics',
      'Custom learning paths',
      'Team collaboration',
      'Priority processing'
    ],
    limitations: [],
    buttonText: 'Start Pro Trial',
    buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    popular: false,
  },
]

export default function PricingPage() {
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

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Learning Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade anytime. All plans include access to our AI tutoring platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Features included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/auth/login" className="block">
                  <button className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Yes! Premium and Pro plans include a 7-day free trial. No credit card required.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards and PayPal through our secure Stripe integration.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">Absolutely. Cancel anytime with one click. No cancellation fees or hidden charges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}