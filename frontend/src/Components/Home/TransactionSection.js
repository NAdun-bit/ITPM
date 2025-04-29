import React, { useState } from 'react';

function TransactionSection() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('LKR');
  const [recipient, setRecipient] = useState('');
  const [tab, setTab] = useState('send');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 151.67 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 305.45 },
  ];

  const recentTransactions = [
    { id: 1, name: 'John Smith', amount: 500, currency: 'USD', date: '2025-03-20', status: 'completed' },
    { id: 2, name: 'Emma Johnson', amount: 350, currency: 'EUR', date: '2025-03-18', status: 'completed' },
    { id: 3, name: 'Michael Brown', amount: 200, currency: 'GBP', date: '2025-03-15', status: 'pending' },
    { id: 4, name: 'Sophia Lee', amount: 1000, currency: 'USD', date: '2025-03-10', status: 'completed' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Transaction initiated: ${amount} ${fromCurrency} to ${recipient}`);
    setAmount('');
    setRecipient('');
  };

  const getCurrencySymbol = (code) => {
    const curr = currencies.find(c => c.code === code);
    return curr ? curr.symbol : '$';
  };

  const convertAmount = (amount, from, to) => {
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    return (parseFloat(amount) * toRate / fromRate).toFixed(2);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Modern Transactions</h2>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button className={`flex-1 py-4 text-center font-medium ${tab === 'send' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`} onClick={() => setTab('send')}>Send Money</button>
            <button className={`flex-1 py-4 text-center font-medium ${tab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`} onClick={() => setTab('history')}>Transaction History</button>
            <button className={`flex-1 py-4 text-center font-medium ${tab === 'convert' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`} onClick={() => setTab('convert')}>Currency Converter</button>
          </div>

          <div className="p-6">
            {tab === 'send' && (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                  <input
                    type="text"
                    id="recipient"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Email or phone number"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{getCurrencySymbol(fromCurrency)}</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        id="currency"
                        className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        {currencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>{curr.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Details</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Exchange Rate</span>
                      <span className="font-medium">1 {fromCurrency} = {convertAmount(1, fromCurrency, 'USD')} USD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Fee</span>
                      <span className="font-medium">{getCurrencySymbol(fromCurrency)}0.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">Total</span>
                      <span className="font-bold">{getCurrencySymbol(fromCurrency)}{amount || '0.00'}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200">Send Money</button>
              </form>
            )}

            {tab === 'history' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getCurrencySymbol(transaction.currency)}{transaction.amount}</div>
                            <div className="text-xs text-gray-500">{transaction.currency}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{transaction.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-center">
                  <button className="text-indigo-600 font-medium hover:text-indigo-800">View All Transactions</button>
                </div>
              </div>
            )}

            {tab === 'convert' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">{getCurrencySymbol(fromCurrency)}</span>
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select
                          className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                        >
                          {currencies.map((curr) => (
                            <option key={curr.code} value={curr.code}>{curr.code}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-300 bg-gray-50"
                        placeholder="0.00"
                        value={amount ? convertAmount(amount, fromCurrency, toCurrency) : ''}
                        readOnly
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">{getCurrencySymbol(toCurrency)}</span>
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select
                          className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500"
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                        >
                          {currencies.map((curr) => (
                            <option key={curr.code} value={curr.code}>{curr.code}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span className="font-medium">1 {fromCurrency} = {convertAmount(1, fromCurrency, toCurrency)} {toCurrency}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-medium">{getCurrencySymbol(toCurrency)}0.00</span>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200">Convert Currency</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransactionSection;
