'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    industry: '',
    rating: '',
    size: ''
  });

  const demoClients = [
    {
      id: 1,
      name: 'TechFlow Industries',
      industry: 'Technology',
      size: '$500K - $1M',
      location: 'San Francisco, CA',
      overallRating: 4.2,
      ratings: {
        payment: 4.5,
        communication: 3.8,
        scope: 4.0,
        creativity: 4.5,
        timeline: 4.2
      },
      reviewCount: 23,
      lastReview: '2 days ago',
      flag: '🟢'
    },
    {
      id: 2,
      name: 'Global Marketing Corp',
      industry: 'Marketing',
      size: '$100K - $500K',
      location: 'New York, NY',
      overallRating: 2.8,
      ratings: {
        payment: 2.1,
        communication: 3.2,
        scope: 2.5,
        creativity: 3.8,
        timeline: 2.4
      },
      reviewCount: 17,
      lastReview: '1 week ago',
      flag: '🔴'
    },
    {
      id: 3,
      name: 'StartupXYZ',
      industry: 'Technology',
      size: '$50K - $100K',
      location: 'Austin, TX',
      overallRating: 4.7,
      ratings: {
        payment: 4.9,
        communication: 4.6,
        scope: 4.5,
        creativity: 4.8,
        timeline: 4.7
      },
      reviewCount: 12,
      lastReview: '3 days ago',
      flag: '🟢'
    }
  ];

  const demoReviews = [
    {
      id: 1,
      clientName: 'TechFlow Industries',
      rating: 4.5,
      title: 'Great communication, minor scope creep',
      excerpt: 'Overall positive experience. They communicated well throughout the project and paid on time. However, there were some scope changes that...',
      date: '2 days ago',
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      clientName: 'Global Marketing Corp',
      rating: 2.5,
      title: 'Payment delays and poor communication',
      excerpt: 'Multiple payment delays and difficulty reaching key stakeholders. Project scope changed frequently without proper documentation...',
      date: '1 week ago',
      verified: true,
      helpful: 24
    }
  ];

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`${size} ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Demo Header */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Experience ClientScore
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our platform with real-world examples. See how agencies research clients, 
              read reviews, and make informed business decisions.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
                🔒 This is a demo with anonymized data for illustration purposes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'search', name: 'Client Search', icon: MagnifyingGlassIcon },
            { id: 'profiles', name: 'Client Profiles', icon: BuildingOfficeIcon },
            { id: 'reviews', name: 'Reviews', icon: StarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search Demo */}
        {activeTab === 'search' && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Clients</h3>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies, industries, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select 
                    value={selectedFilters.industry}
                    onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Industries</option>
                    <option value="technology">Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                  <select 
                    value={selectedFilters.rating}
                    onChange={(e) => setSelectedFilters({...selectedFilters, rating: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Size</label>
                  <select 
                    value={selectedFilters.size}
                    onChange={(e) => setSelectedFilters({...selectedFilters, size: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Size</option>
                    <option value="large">$500K+</option>
                    <option value="medium">$100K - $500K</option>
                    <option value="small">Under $100K</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {demoClients.map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">{client.name}</h4>
                          <span className="ml-2 text-lg">{client.flag}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                          <span>{client.industry}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {client.location}
                          </span>
                          <span>•</span>
                          <span>{client.size}</span>
                        </div>
                        <div className="mt-2">
                          {renderStars(client.overallRating)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{client.reviewCount} reviews</div>
                        <div className="text-xs text-gray-400">Last: {client.lastReview}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Client Profile Demo */}
        {activeTab === 'profiles' && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      TechFlow Industries
                      <span className="ml-2 text-2xl">🟢</span>
                    </h2>
                    <div className="mt-2 flex items-center text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        Technology
                      </span>
                      <span className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        San Francisco, CA
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Founded 2018
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">4.2</div>
                    <div className="text-sm text-gray-500">23 reviews</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(demoClients[0].ratings).map(([category, rating]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-gray-700">{category}</span>
                          <div className="flex items-center">
                            {renderStars(rating, 'w-3 h-3')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Consistently pays on time</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Clear project requirements</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Occasional scope changes</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Responsive communication</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Demo */}
        {activeTab === 'reviews' && (
          <div className="mt-8">
            <div className="space-y-6">
              {demoReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium text-gray-900">{review.clientName}</h4>
                        {review.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        {renderStars(review.rating)}
                      </div>
                      <h5 className="mt-2 text-md font-medium text-gray-900">{review.title}</h5>
                      <p className="mt-2 text-gray-600">{review.excerpt}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500">{review.date}</div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {review.helpful} found helpful
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">
                      Helpful
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 mt-16">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to access</span>
            <span className="block">real client insights?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of agencies making smarter client decisions with verified reviews and comprehensive data.
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