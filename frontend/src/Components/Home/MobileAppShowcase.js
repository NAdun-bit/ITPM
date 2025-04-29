import React from 'react';

function MobileAppShowcase() {
  const appFeatures = [
    {
      title: "Instant Transfers",
      description: "Send money globally in seconds with just a few taps"
    },
    {
      title: "Expense Tracking",
      description: "Categorize and monitor your spending with detailed insights"
    },
    {
      title: "Bill Splitting",
      description: "Easily split bills with friends and family without awkward calculations"
    },
    {
      title: "Payment Reminders",
      description: "Never miss a payment with automated reminders and scheduling"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-6">Experience Our Mobile App</h2>
            <p className="text-lg mb-8 text-gray-300">
              Take control of your finances on the go with our feature-rich mobile application. 
              Available for iOS and Android devices.
            </p>
            
            <div className="space-y-6">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-10">
              <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,12A5.5,5.5 0 0,1 12,17.5A5.5,5.5 0 0,1 6.5,12A5.5,5.5 0 0,1 12,6.5A5.5,5.5 0 0,1 17.5,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                App Store
              </button>
              <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative z-10">
                <img 
                  src="/logos/app.png"  
                  alt="Mobile app interface" 
                  className="w-80 h-auto rounded-3xl shadow-2xl border-8 border-gray-800"
                />
                <div className="absolute -right-16 top-20 bg-white text-black p-4 rounded-lg shadow-xl">
                  <div className="font-bold">$1,250.00</div>
                  <div className="text-xs text-gray-500">Last transaction</div>
                </div>
                <div className="absolute -left-16 bottom-20 bg-white text-black p-4 rounded-lg shadow-xl">
                  <div className="font-bold text-green-500">+$350.00</div>
                  <div className="text-xs text-gray-500">Received today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileAppShowcase;