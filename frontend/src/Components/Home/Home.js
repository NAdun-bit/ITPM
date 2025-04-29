import React from 'react';
import TransactionSection from './TransactionSection';
import AdvancedFeatures from './AdvancedFeatures';
import MobileAppShowcase from './MobileAppShowcase';
import ScheduleTransaction from "./ScheduleTransaction";
import { ArrowRight, ChevronRight, ChevronLeft, Check, DollarSign, Globe, Shield, Clock } from "react-feather";


function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Simple, Transparent, and Affordable Global Transactions
              </h1>
              <p className="text-lg mb-8 text-gray-300">
                Send money internationally with low fees and great exchange rates. Our platform makes global transfers easy and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-black px-6 py-3 rounded-md font-medium">
                  Get Started
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-md font-medium">
                  Create an account
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/logos/siri.png"  
                alt="Mobile app mockup" 
                className="w-80 h-auto"
              />
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="bg-gray-200 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <span className="text-gray-600 font-semibold text-lg">Bank of America</span>
              <span className="text-gray-600 font-semibold text-lg">Citigroup</span>
              <span className="text-gray-600 font-semibold text-lg">JPMorgan Chase & Co</span>
              <span className="text-gray-600 font-semibold text-lg">Morgan Stanley</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
            <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">
              We provide the best service for  money transfers with competitive rates and secure transactions.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">International Transfer</h3>
                <p className="text-gray-600">
                  Send money to over 100 countries worldwide with competitive exchange rates and low fees.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Safe and Secure</h3>
                <p className="text-gray-600">
                  Your transactions are protected with bank-level security and encryption technology.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Transparency & Simplicity</h3>
                <p className="text-gray-600">
                  No hidden fees. Know exactly what you're paying and what your recipient will get.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        <TransactionSection />
        <MobileAppShowcase />
        <AdvancedFeatures />

        {/* Multiple Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Multiple Features we Offer</h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src="/logos/hero-bg.png" 
                  alt="App features" 
                  className="w-full max-w-md mx-auto shadow-xl rounded-lg"
                />
              </div>
              <div className="md:w-1/2 space-y-8">
                {[
                  {
                    title: "Real-time Currency Exchange",
                    desc: "Get up-to-date exchange rates and calculate your transfers instantly.",
                  },
                  {
                    title: "Bank-level Security",
                    desc: "Your data and transactions are protected with advanced encryption.",
                  },
                  {
                    title: "Transaction History",
                    desc: "Access and download reports of all your past transactions.",
                  },
                  {
                    title: "Multiple Payment Methods",
                    desc: "Choose from various payment options including bank transfers and cards.",
                  }
                ].map((feature, idx) => (
                  <div className="flex gap-4" key={idx}>
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="font-bold mb-2">What is the maximum I can send through Quartz Money Transfer Service?</h3>
                <p className="text-gray-600">You can send up to $10,000 per transaction and up to $50,000 per month.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What fee do I pay for transfers to my Virtual Money Transfer Account?</h3>
                <p className="text-gray-600">We charge a flat fee of 0.5% for all transfers, with no hidden costs.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">How long does it take for my Virtual Money Transfer Account to receive the money?</h3>
                <p className="text-gray-600">Most transfers are completed within 1-2 business days, depending on the destination country.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Can I have Multiple Money Transfer Accounts for my Virtual Money Transfer Account?</h3>
                <p className="text-gray-600">Yes, you can have up to 5 different currency accounts linked to your main profile.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What is the Time Conversion Rate during Virtual Money Transfer Account?</h3>
                <p className="text-gray-600">We use real-time exchange rates with a small margin of 0.3% above the mid-market rate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Animated Background */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  d="M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z"
                  className="animate-wave"
                />
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="2"
                  d="M0,20 Q50,70 100,20 V100 Q50,50 0,100 Z"
                  className="animate-wave animation-delay-1000"
                />
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your banking experience?</h2>
              <p className="text-xl mb-8 text-indigo-200">
                Join millions of satisfied customers who have switched to BankApp for their banking needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
                  Get Started Now
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-indigo-900 transition-all duration-300 transform hover:scale-105">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>



      </main>
    </div>
  );
}

export default Home;
