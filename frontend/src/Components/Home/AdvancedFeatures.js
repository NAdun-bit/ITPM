import React from 'react';
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Clock, 
  BarChart, 
  Users 
} from 'react-feather';

function AdvancedFeatures() {
  const features = [
    {
      icon: <Bell className="w-6 h-6 text-indigo-600" />,
      title: "Real-time Notifications",
      description: "Get instant alerts for all your transactions and account activities through push notifications, email, or SMS."
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      title: "Advanced Security",
      description: "Two-factor authentication, biometric verification, and end-to-end encryption to keep your money and data safe."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      title: "Virtual Cards",
      description: "Create virtual cards for online purchases with customizable spending limits and automatic expiration."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
      title: "Mobile Wallet Integration",
      description: "Connect with popular mobile wallets like Apple Pay, Google Pay, and Samsung Pay for seamless transactions."
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      title: "Multi-currency Accounts",
      description: "Hold, exchange, and manage multiple currencies in one place with competitive exchange rates."
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: "Scheduled Transfers",
      description: "Set up recurring payments or schedule one-time transfers for future dates with automated reminders."
    },
    {
      icon: <BarChart className="w-6 h-6 text-indigo-600" />,
      title: "Spending Analytics",
      description: "Track your spending patterns with detailed charts and insights to help you manage your finances better."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Group Payments",
      description: "Split bills, collect money for events, or manage shared expenses with friends and family easily."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers a comprehensive suite of advanced features designed to make your financial transactions 
            more secure, convenient, and efficient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdvancedFeatures;