import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/forms/LoginForm';
import RegisterForm from './components/forms/RegisterForm';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import ProjectsPage from './pages/ProjectsPage';

// Landing Page Component
const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState('donor');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const handleStartDonating = () => {
    setRegisterRole('donor');
    setShowRegister(true);
  };

  const handleJoinAsNGO = () => {
    setRegisterRole('ngo');
    setShowRegister(true);
  };

  const handleSignIn = () => {
    setShowLogin(true);
  };

  const switchToRegister = (role = 'donor') => {
    setShowLogin(false);
    setRegisterRole(role);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Raju",
      role: "Monthly Donor",
      text: "Finally, I can see exactly where my money goes. Watching the school construction progress through photos and updates has been incredible.",
      avatar: "👩‍💼"
    },
    {
      name: "Green Earth Foundation",
      role: "NGO Partner",
      text: "DonateTrack helped us increase donor trust by 300%. The transparency tools make reporting effortless and impactful.",
      avatar: "🌱"
    },
    {
      name: "Nagaraju Reddy",
      role: "Corporate Sponsor",
      text: "Our company's CSR initiatives have never been more effective. Real-time impact tracking has transformed our giving strategy.",
      avatar: "👨‍💼"
    }
  ];

  const projects = [
    {
      title: "Clean Water for Villages",
      ngo: "Water Hope Foundation",
      raised: 85,
      target: 50000,
      supporters: 234,
      image: "🚰",
      location: "Rural Kenya",
      urgency: "High"
    },
    {
      title: "Education for All",
      ngo: "Learning Bridge NGO",
      raised: 67,
      target: 30000,
      supporters: 156,
      image: "📚",
      location: "Bangladesh",
      urgency: "Medium"
    },
    {
      title: "Emergency Food Relief",
      ngo: "Hunger Relief International",
      raised: 92,
      target: 75000,
      supporters: 412,
      image: "🍽️",
      location: "Yemen",
      urgency: "Critical"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  DonateTrack
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                How it Works
              </button>
              <button onClick={handleSignIn} className="btn-secondary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50"></div>
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-16">
          {/* Trust Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 mb-8 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-green-700 font-semibold text-sm">🔒 Verified by 1,000+ NGOs • $5M+ Tracked</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-none">
            <span className="block">Bridge the</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent block">
              Trust Gap
            </span>
            <span className="text-4xl md:text-5xl lg:text-6xl text-gray-600 block mt-4">
              Between Hearts & Hands
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect directly with verified NGOs. Track every dollar in real-time. 
            <br />
            <span className="text-blue-600 font-semibold">See the faces behind your impact.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={handleStartDonating}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Giving Impact
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
              onClick={handleJoinAsNGO}
              className="group px-12 py-4 bg-white text-gray-800 text-xl font-bold rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <span className="flex items-center">
                Join as NGO
                <div className="ml-3 w-8 h-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  🏢
                </div>
              </span>
            </button>
          </div>

          {/* Live Impact Demo */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Demo Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-600 font-medium">Live Impact Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Real-time Updates</span>
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 space-y-8">
                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-blue-700 mb-2">$847K</div>
                    <div className="text-blue-600 font-medium">Total Donations</div>
                    <div className="text-xs text-blue-500 mt-1">↗️ +23% this month</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-green-700 mb-2">3,247</div>
                    <div className="text-green-600 font-medium">Lives Changed</div>
                    <div className="text-xs text-green-500 mt-1">👥 Real people helped</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-purple-700 mb-2">247</div>
                    <div className="text-purple-600 font-medium">Active NGOs</div>
                    <div className="text-xs text-purple-500 mt-1">🏢 Verified partners</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-teal-700 mb-2">99.7%</div>
                    <div className="text-teal-600 font-medium">Trust Score</div>
                    <div className="text-xs text-teal-500 mt-1">✅ Verified impact</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    Live Activity Stream
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl">💧</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">Sarah M. donated $150</div>
                        <div className="text-sm text-gray-500">Clean Water Project • 2 minutes ago</div>
                      </div>
                      <div className="text-green-600 font-bold">+3 people served</div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl">📚</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">Learning Bridge NGO uploaded progress</div>
                        <div className="text-sm text-gray-500">School Construction • 5 minutes ago</div>
                      </div>
                      <div className="text-blue-600 font-bold">75% complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose DonateTrack?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience complete transparency and build lasting trust through our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="card h-full border-2 border-transparent group-hover:border-primary-200 group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Real-Time Impact Tracking</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Watch your donations transform lives with live updates, photos, and detailed impact reports from the field.
                </p>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="card h-full border-2 border-transparent group-hover:border-secondary-200 group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Verified Transparency</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Every transaction is documented with receipts, photos, and beneficiary information for complete accountability.
                </p>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="card h-full border-2 border-transparent group-hover:border-accent-200 group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Community Building</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Connect directly with beneficiaries and NGOs to build lasting relationships and sustainable impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Making a Real Difference
            </h2>
            <p className="text-xl text-primary-100">
              Join thousands of donors and NGOs creating transparent impact
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">$2.5M+</div>
              <div className="text-primary-100">Donations Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">15K+</div>
              <div className="text-primary-100">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">NGO Partners</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">99.2%</div>
              <div className="text-primary-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              How the
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Magic </span>
              Happens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transparent, impactful giving that builds lasting connections
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
              <svg className="w-full h-2" viewBox="0 0 800 20">
                <defs>
                  <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <path d="M50 10 Q400 0 750 10" stroke="url(#connectionGrad)" strokeWidth="3" fill="none" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Step 1: Donors */}
              <div className="group text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl">❤️</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Donors Give with Heart</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Choose verified projects, set impact goals, and give with complete confidence knowing exactly where your money goes.
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-blue-700 mb-2">Popular Actions:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Monthly Giving</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Impact Tracking</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Direct Messages</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Bridge */}
              <div className="group text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl">🌉</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Bridges Trust</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Our technology ensures complete transparency with real-time tracking, verified receipts, and direct communication channels.
                </p>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-purple-700 mb-2">Trust Features:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Blockchain Verified</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Photo Updates</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Live Chat</span>
                  </div>
                </div>
              </div>

              {/* Step 3: NGOs */}
              <div className="group text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl">🤝</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">NGOs Create Impact</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Verified organizations share real-time updates, photos, and stories, creating lasting relationships with their supporters.
                </p>
                <div className="bg-teal-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-teal-700 mb-2">NGO Tools:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">Progress Updates</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">Impact Reports</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">Supporter Network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Projects Section */}
      <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Live</span> Projects
              <br />Need Your Help
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See real projects making immediate impact. Every donation is tracked from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Project Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{project.image}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                      project.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.urgency}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-2">by {project.ngo}</p>
                  <p className="text-sm text-gray-500">📍 {project.location}</p>
                </div>

                {/* Progress */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                    ₹{(project.target * project.raised / 100).toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      of ₹{project.target.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-1000 relative"
                      style={{ width: `₹{project.raised}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                    <span>{project.raised}% funded</span>
                    <span>👥 {project.supporters} supporters</span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 group-hover:scale-105">
                    Donate Now & Track Impact
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white text-gray-800 font-bold rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
              View All 247+ Active Projects →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Voices from Our
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Community</span>
            </h2>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center max-w-4xl mx-auto">
              <div className="text-6xl mb-6">{testimonials[currentTestimonial].avatar}</div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="font-bold text-gray-900 text-xl">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-gray-600">
                {testimonials[currentTestimonial].role}
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make Transparent Impact?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join our community of donors and NGOs committed to building trust through transparency
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartDonating}
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Your Journey
            </button>
            <button className="btn-secondary text-lg px-8 py-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold">DonateTrack</span>
              </div>
              <p className="text-gray-400">
                Building trust between donors and NGOs through complete transparency and verified impact tracking.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Donors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For NGOs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DonateTrack. All rights reserved. Built with ❤️ for transparency.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginForm 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={switchToRegister}
        />
      )}
      
      {showRegister && (
        <RegisterForm 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={switchToLogin}
          defaultRole={registerRole}
        />
      )}
    </div>
  );
};

// Protected Route Component (Modified for testing)
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // For testing: allow access without authentication but create mock user
  if (!isAuthenticated && role) {
    // Create mock user context for testing
    const mockUser = {
      id: '1',
      name: role === 'donor' ? 'Test Donor' : 'Test NGO',
      email: `test@${role}.com`,
      role: role,
      organization: role === 'ngo' ? 'Test Foundation' : undefined,
    };
    
    return React.cloneElement(children, { mockUser });
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Dashboard Router Component
const DashboardRouter = ({ mockUser }) => {
  const { user } = useAuth();
  const currentUser = user || mockUser;
  
  if (currentUser?.role === 'donor') {
    return <DonorDashboard testUser={mockUser} />;
  } else if (currentUser?.role === 'ngo') {
    return <NGODashboard testUser={mockUser} />;
  }
  
  return <Navigate to="/" />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          {/* Testing Routes - Direct access to dashboards */}
          <Route 
            path="/donor-dashboard" 
            element={
              <ProtectedRoute role="donor">
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ngo-dashboard" 
            element={
              <ProtectedRoute role="ngo">
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
