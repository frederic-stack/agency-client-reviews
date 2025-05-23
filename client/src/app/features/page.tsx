import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  EyeSlashIcon,
  StarIcon,
  ChartBarIcon,
  LockClosedIcon,
  SearchIcon,
  BellIcon,
  CogIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  const features = [
    {
      name: 'Complete Anonymity',
      description: 'Advanced anonymization protocols protect your identity while sharing honest feedback about client experiences.',
      icon: EyeSlashIcon,
      highlights: ['Zero-knowledge architecture', 'Anonymous review submission', 'Protected professional relationships']
    },
    {
      name: 'Verified Members Only',
      description: 'Strict verification process ensures only legitimate agencies and vendors can access our platform.',
      icon: ShieldCheckIcon,
      highlights: ['Business verification required', 'LinkedIn profile validation', 'Industry credential checks']
    },
    {
      name: 'Comprehensive Rating System',
      description: 'Rate clients across multiple dimensions to provide complete picture of working relationships.',
      icon: StarIcon,
      highlights: ['Payment reliability scoring', 'Communication quality metrics', 'Project scope adherence', 'Creative freedom index']
    },
    {
      name: 'Advanced Search & Filtering',
      description: 'Powerful search tools help you find exactly the client information you need.',
      icon: SearchIcon,
      highlights: ['Industry-specific filters', 'Rating-based searches', 'Geographic location filters', 'Project size categories']
    },
    {
      name: 'Real-time Notifications',
      description: 'Stay updated with new reviews and platform updates that matter to your business.',
      icon: BellIcon,
      highlights: ['New review alerts', 'Industry trend updates', 'Platform announcements', 'Custom notification preferences']
    },
    {
      name: 'Enterprise Security',
      description: 'Bank-level security protects your data and maintains platform integrity.',
      icon: LockClosedIcon,
      highlights: ['End-to-end encryption', 'SOC 2 compliance', 'Regular security audits', 'GDPR compliant']
    },
    {
      name: 'Smart Analytics',
      description: 'Gain insights into client trends and industry patterns to make better business decisions.',
      icon: ChartBarIcon,
      highlights: ['Industry trend analysis', 'Rating distribution insights', 'Market intelligence reports', 'Performance benchmarks']
    },
    {
      name: 'Professional Moderation',
      description: 'Human moderators ensure all content maintains professional standards and accuracy.',
      icon: DocumentCheckIcon,
      highlights: ['Expert content review', 'Bias detection systems', 'Professional standards enforcement', '24/7 monitoring']
    }
  ];

  const useCases = [
    {
      title: 'Pre-Pitch Research',
      description: 'Research potential clients before investing time in proposals and pitches.',
      benefits: ['Avoid problematic clients', 'Tailor your approach', 'Set appropriate expectations']
    },
    {
      title: 'Contract Negotiation',
      description: 'Use peer insights to negotiate better terms and protect your agency.',
      benefits: ['Payment term insights', 'Scope change patterns', 'Communication preferences']
    },
    {
      title: 'Risk Assessment',
      description: 'Evaluate potential risks before taking on new client relationships.',
      benefits: ['Payment reliability scores', 'Project complexity insights', 'Timeline reality checks']
    },
    {
      title: 'Industry Intelligence',
      description: 'Stay informed about trends and changes in your industry landscape.',
      benefits: ['Market trend awareness', 'Competitive intelligence', 'Best practice sharing']
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
                <Link href="/features" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
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
      <div className="relative bg-white pt-16 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Powerful Features for</span>
              <span className="block text-indigo-600">Smarter Business Decisions</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              Everything you need to share and discover client experiences safely, anonymously, and professionally.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative bg-white py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How Agencies Use ClientScore</h2>
            <p className="mt-4 text-xl text-gray-600">Real-world applications that drive business success</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to experience</span>
            <span className="block">these powerful features?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of agencies already making smarter client decisions with ClientScore.
          </p>
          <Link 
            href="/register" 
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors"
          >
            Start Free Trial
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