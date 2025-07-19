"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CheckCircle, XCircle, ArrowRight, DollarSign, Send, Zap } from "lucide-react"
import { LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "../store/authStore"
import { toast } from "react-hot-toast"

const TransactionPage = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    accountNumber: "",
    ifsc: "",
    purpose: "",
    note: "",
  })
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [animationStep, setAnimationStep] = useState(0)
  const [fieldErrors, setFieldErrors] = useState({})
  const { logout } = useAuthStore();

  // Animation cycle for the left side
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Format IFSC code (4 letters + 7 alphanumeric)
  const formatIFSC = (value) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '')
    
    // Format as XXXX0000000 (4 letters + 7 alphanumeric)
    if (cleaned.length <= 4) {
      return cleaned.toUpperCase()
    } else {
      return (cleaned.slice(0, 4) + cleaned.slice(4, 11)).toUpperCase()
    }
  }

  // Format account number (only numbers, max 15 digits)
  const formatAccountNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '')
    
    // Limit to 15 digits
    return cleaned.slice(0, 15)
  }

  // Validate IFSC code
  const validateIFSC = (ifsc) => {
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/
    return ifscPattern.test(ifsc)
  }

  // Validate account number
  const validateAccountNumber = (accountNumber) => {
    return accountNumber.length >= 9 && accountNumber.length <= 15
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    // Apply formatting based on field type
    if (name === 'ifsc') {
      formattedValue = formatIFSC(value)
    } else if (name === 'accountNumber') {
      formattedValue = formatAccountNumber(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!validateIFSC(formData.ifsc)) {
      errors.ifsc = "IFSC code must be 11 characters: 4 letters + 7 alphanumeric (e.g., SBIN0001234)"
    }

    if (!validateAccountNumber(formData.accountNumber)) {
      errors.accountNumber = "Account number must be 9-15 digits"
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Please enter a valid amount"
    }

    if (!formData.recipient.trim()) {
      errors.recipient = "Recipient name is required"
    }

    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("")
    setError("")

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/api/transactions", formData, {
        withCredentials: true, // Include cookies in the request
      })
      setStatus("Transaction Successful")
      setFormData({ amount: "", recipient: "", accountNumber: "", ifsc: "", purpose: "", note: "" })
      setFieldErrors({})
      toast.success("Transaction completed successfully!")
    } catch (err) {
      console.error('Transaction error:', err)
      setError("Transaction Failed")
      toast.error("Transaction failed. Please try again.")
    }
  }

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-auto">
      {/* Logout Button - Top Right */}
      <div className="absolute top-6 right-8 z-20">
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 4px 24px rgba(59,130,246,0.15)" }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-full shadow-md font-semibold transition-all duration-200 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name <span className="text-red-500" title="Required">*</span>
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                    fieldErrors.recipient ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.recipient && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.recipient}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500" title="Required">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1234567890"
                  maxLength={15}
                  className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                    fieldErrors.accountNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.accountNumber}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">9-15 digits only</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code <span className="text-red-500" title="Required">*</span>
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white uppercase ${
                    fieldErrors.ifsc ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.ifsc && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.ifsc}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Format: XXXX0000000 (4 letters + 7 alphanumeric)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500" title="Required">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g. 500"
                  className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                    fieldErrors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.amount && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.amount}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-red-500" title="Required">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bill Payment / Rent / Gift"
                  rows={3}
                  className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                    fieldErrors.purpose ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.purpose && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.purpose}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add a note (optional)"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
