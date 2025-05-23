import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function PricingPage() {
  const plans = [
    {
      name: 'Freelancer',
      price: 'Free',
      period: '',
      description: 'Perfect for individual freelancers and small agencies getting started.',
      features: [
        'Access to client reviews',
        'Basic search and filters',
        'Submit up to 3 reviews per month',
        'Community support',
        'Email notifications'
      ],
      limitations: [
        'Limited search results',
        'No advanced analytics',
        'Standard verification process'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For growing agencies that need deeper insights and enhanced features.',
      features: [
        'Everything in Freelancer',
        'Unlimited review submissions',
        'Advanced search and filtering',
        'Client analytics and trends',
        'Priority verification',
        'Export data capabilities',
        'Email and SMS notifications',
        'Industry benchmarking'
      ],
      limitations: [],
      cta: 'Start 14-Day Trial',
      popular: true,
      color: 'indigo'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large agencies and organizations with custom requirements.',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Advanced analytics dashboard',
        'Dedicated account manager',
        'Custom verification process',
        'White-label options',
        'API access',
        'Priority support',
        'Custom reporting',
        'SSO integration',
        'Team management tools'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'purple'
    }
  ];

  const faqs = [
    {
      question: 'How does the verification process work?',
      answer: 'We verify all members through a multi-step process including business registration verification, LinkedIn profile validation, and industry credential checks. This ensures only legitimate agencies and vendors can access the platform.'
    },
    {
      question: 'Is my identity really protected?',
      answer: 'Yes, we use advanced anonymization protocols and zero-knowledge architecture. Your reviews are completely anonymous, and we cannot trace them back to your identity even if we wanted to.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Absolutely! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at your next billing cycle.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your anonymous reviews remain on the platform to benefit the community, but your account data is securely deleted within 30 days of cancellation.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual subscribers save 20% compared to monthly billing. Contact us for volume discounts on Enterprise plans.'
    },
    {
      question: 'Can I try before I buy?',
      answer: 'Professional plan includes a 14-day free trial with full access to all features. No credit card required to start.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ClientScore</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/features" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Simple, Transparent</span>
              <span className="block text-indigo-600">Pricing</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the plan that fits your agency&apos;s needs. Start free and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative bg-gray-50 py-16 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`relative bg-white rounded-xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-indigo-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-indigo-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-xl text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="mt-4 text-gray-500">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md transition-colors ${
                      plan.popular
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                        : 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Compare Plans</h2>
            <p className="mt-4 text-xl text-gray-600">See what&apos;s included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Freelancer
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Review Submissions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">3/month</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Unlimited</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Advanced Analytics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-500">✓</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    API Access
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-500">✓</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Priority Support
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of agencies making smarter client decisions with ClientScore.
          </p>
          <Link 
            href="/register" 
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-500">
              Contact
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 ClientScore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 