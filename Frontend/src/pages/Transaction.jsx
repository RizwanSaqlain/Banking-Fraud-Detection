// import React, { useState } from 'react';
// import axios from 'axios';
// import { CheckCircle, XCircle } from 'lucide-react'; // Optional icon library (lucide-react)

// const TransactionPage = () => {
//   const [formData, setFormData] = useState({
//     amount: '',
//     recipient: '',
//     purpose: '',
//   });

//   const [status, setStatus] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('');
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         'http://localhost:5000/api/transactions',
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setStatus('Transaction Successful');
//       setFormData({ amount: '', recipient: '', purpose: '' });
//     } catch (err) {
//       console.error(err);
//       setError('Transaction Failed');
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
//       <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
//         💸 Make a Transaction
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Recipient Name
//           </label>
//           <input
//             type="text"
//             name="recipient"
//             value={formData.recipient}
//             onChange={handleChange}
//             required
//             placeholder="e.g. Ramesh Kumar"
//             className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Amount (₹)
//           </label>
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             required
//             placeholder="e.g. 500"
//             className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Purpose
//           </label>
//           <textarea
//             name="purpose"
//             value={formData.purpose}
//             onChange={handleChange}
//             required
//             placeholder="e.g. Bill Payment / Rent / Gift"
//             className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-md"
//         >
//           🚀 Send Money
//         </button>
//       </form>

//       {status && (
//         <div className="mt-6 flex items-center justify-center text-green-600 gap-2 text-sm font-medium">
//           <CheckCircle className="w-5 h-5" />
//           {status}
//         </div>
//       )}

//       {error && (
//         <div className="mt-6 flex items-center justify-center text-red-600 gap-2 text-sm font-medium">
//           <XCircle className="w-5 h-5" />
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionPage;



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CheckCircle, XCircle, ArrowRight, DollarSign, Send, Zap } from "lucide-react"

const TransactionPage = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    purpose: "",
  })
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [animationStep, setAnimationStep] = useState(0)

  // Animation cycle for the left side
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("")
    setError("")

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post("http://localhost:5000/api/transactions", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStatus("Transaction Successful")
      setFormData({ amount: "", recipient: "", purpose: "" })
    } catch (err) {
      console.error(err)
      setError("Transaction Failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Animation/Illustration */}
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="relative w-full max-w-md">
            {/* Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute w-48 h-48 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-30 animate-ping"></div>
            </div>

            {/* Main Animation Container */}
            <div className="relative z-10 flex flex-col items-center space-y-8">
              {/* Sender */}
              <div
                className={`flex items-center space-x-4 transition-all duration-1000 ${
                  animationStep >= 1 ? "transform translate-x-4 scale-110" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-black" />
                </div>
                <div className="text-lg font-semibold text-gray-700">You</div>
              </div>

              {/* Arrow Animation */}
              <div className="relative">
                <ArrowRight
                  className={`w-12 h-12 text-blue-500 transition-all duration-1000 ${
                    animationStep >= 1 ? "transform translate-x-8 scale-125 text-green-500" : ""
                  }`}
                />

                {/* Money particles */}
                <div className="absolute -top-2 -right-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 bg-yellow-400 rounded-full transition-all duration-1000 ${
                        animationStep >= 1
                          ? `transform translate-x-${(i + 1) * 4} -translate-y-${(i + 1) * 2} opacity-0`
                          : "opacity-100"
                      }`}
                      style={{
                        left: `${i * 8}px`,
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div
                className={`flex items-center space-x-4 transition-all duration-1000 ${
                  animationStep >= 2 ? "transform -translate-x-4 scale-110" : ""
                }`}
              >
                <div className="text-lg font-semibold text-gray-700">Recipient</div>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Send className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Success indicator */}
              {animationStep === 2 && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Transfer Complete!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 animate-float">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: "1s" }}>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="absolute bottom-12 left-8 animate-float" style={{ animationDelay: "2s" }}>
              <Send className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mt-8 space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fast & Secure Transfers
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Send money instantly to anyone, anywhere. Your transactions are protected with bank-level security.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center text-black">
          <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Make a Transaction</h2>
              <p className="text-gray-600">Fill in the details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bill Payment / Rent / Gift"
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Money</span>
              </button>
            </form>

            {status && (
              <div className="mt-6 flex items-center justify-center text-green-600 gap-2 text-sm font-medium bg-green-50 py-3 px-4 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5" />
                {status}
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center justify-center text-red-600 gap-2 text-sm font-medium bg-red-50 py-3 px-4 rounded-xl border border-red-200">
                <XCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default TransactionPage
