import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  EyeSlashIcon,
  StarIcon,
  ChartBarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

// ✅ DEPLOYMENT READY: Build successful, all ESLint errors fixed
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ClientScore</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/features" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pricing
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Anonymous</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Client Reviews</span>{' '}
                  <span className="block xl:inline">for Agencies</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Share your experiences working with clients anonymously. Help fellow agencies make informed decisions 
                  while protecting your professional relationships. Join the trusted community of verified agencies and vendors.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link 
                      href="/register" 
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Join as Agency
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link 
                      href="/demo" 
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      View Demo
                    </Link>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">Trusted by leading agencies worldwide</p>
                  <div className="flex items-center space-x-6 text-gray-400">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">Verified Only</span>
                    </div>
                    <div className="flex items-center">
                      <EyeSlashIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">100% Anonymous</span>
                    </div>
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">Enterprise Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to make informed decisions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides comprehensive tools for agencies to share and discover client experiences safely and anonymously.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <EyeSlashIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Complete Anonymity</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Your identity is protected with advanced anonymization protocols. Share honest feedback without compromising professional relationships.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verified Members Only</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Strict verification process ensures only legitimate agencies and vendors can access the platform.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <StarIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Comprehensive Ratings</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Rate clients on payment reliability, communication, scope adherence, creative freedom, and timeliness.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Advanced Search & Filters</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Find clients by industry, rating, project size, and location. Make data-driven business decisions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to make better</span>
            <span className="block">client decisions?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of agencies already using ClientScore to share insights and discover reliable clients.
          </p>
          <Link 
            href="/register" 
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors"
          >
            Get Started Today
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
