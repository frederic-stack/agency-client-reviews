import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  LightBulbIcon,
  HeartIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const values = [
    {
      name: 'Anonymity First',
      description: 'We believe honest feedback requires complete anonymity. Our zero-knowledge architecture ensures your identity is never revealed.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Community Driven',
      description: 'Built by agencies, for agencies. Every feature is designed to solve real problems faced by creative professionals.',
      icon: UserGroupIcon,
    },
    {
      name: 'Innovation',
      description: 'We continuously evolve our platform to meet the changing needs of the agency landscape.',
      icon: LightBulbIcon,
    },
    {
      name: 'Trust & Integrity',
      description: 'Every review is verified, every member is authenticated, and every process is transparent.',
      icon: HeartIcon,
    },
  ];

  const stats = [
    { number: '10K+', label: 'Verified Agencies' },
    { number: '50K+', label: 'Client Reviews' },
    { number: '95%', label: 'Payment Accuracy' },
    { number: '24/7', label: 'Support Available' },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: '15 years leading digital agencies. Former VP at WPP.',
      image: '👩‍💼',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Former Principal Engineer at Stripe. Expert in privacy tech.',
      image: '👨‍💻',
    },
    {
      name: 'Emily Park',
      role: 'Head of Product',
      bio: '10 years in B2B SaaS. Former Product Lead at Slack.',
      image: '👩‍🔬',
    },
    {
      name: 'David Kim',
      role: 'Head of Security',
      bio: 'Cybersecurity expert. Former NSA, now protecting agency data.',
      image: '👨‍🔒',
    },
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
                <Link href="/pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
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
      <div className="relative bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Empowering Agencies with</span>
              <span className="block text-indigo-600">Honest Client Intelligence</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              We're building the world's most trusted platform for agency-client insights, 
              helping creative professionals make informed business decisions through anonymous, verified reviews.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Democratizing Client Intelligence
            </p>
            <p className="mt-4 max-w-4xl text-xl text-gray-500 lg:mx-auto">
              For too long, agencies have operated in the dark when it comes to client relationships. 
              Horror stories are shared in whispers at industry events, but actionable intelligence remains elusive. 
              We're changing that by creating a secure, anonymous platform where agencies can share authentic 
              experiences and make data-driven client decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
              <p className="mt-4 text-lg text-gray-600">
                ClientScore was born from a painful experience. Our founders, Sarah and Marcus, 
                ran a successful digital agency that took on what seemed like a dream client—a well-known 
                brand with a generous budget and exciting creative challenges.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Six months later, after countless scope changes, payment delays, and communication 
                breakdowns, they realized this "dream client" was actually a nightmare that nearly 
                bankrupted their agency. The worst part? Other agencies had similar experiences 
                with the same client, but there was no way to share this crucial information.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                That's when they decided to build ClientScore—a platform where agencies could 
                anonymously share their real experiences, helping the entire creative community 
                make better business decisions.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-8">
              <div className="text-center">
                <GlobeAltIcon className="mx-auto h-12 w-12 text-indigo-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Global Impact</h3>
                <p className="mt-2 text-gray-600">
                  Since our launch, we've helped agencies avoid $50M+ in problematic client relationships 
                  and enabled thousands of successful partnerships through better client intelligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Drives Us Every Day
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{value.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{value.description}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by the Creative Community
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Our platform continues to grow as more agencies discover the power of shared intelligence
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-extrabold text-white">{stat.number}</div>
                <div className="mt-1 text-lg text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-xl text-gray-600">
              Former agency owners and tech leaders building the future of client intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-medium">{member.role}</p>
                <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Join Our Mission</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're always looking for talented individuals who share our passion for empowering 
              the creative community. Whether you're a developer, designer, marketer, or industry expert, 
              we'd love to hear from you.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link 
                href="/careers" 
                className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                View Open Positions
              </Link>
              <Link 
                href="/contact" 
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to make</span>
            <span className="block">smarter client decisions?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join the thousands of agencies already using ClientScore to build better businesses.
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