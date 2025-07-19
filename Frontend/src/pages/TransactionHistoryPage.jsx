import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { LogOut, Loader, CheckCircle, XCircle, Calendar, User, CreditCard, Building, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "../utils/date";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/transactions" : "/api/transactions";

export default function TransactionHistoryPage() {
  const { logout } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to mask sensitive data (show only last 4 characters)
  const maskData = (data, type = 'default') => {
    if (!data) return '';
    
    if (type === 'account') {
      // For account number: show last 4 digits, mask the rest
      const length = data.length;
      if (length <= 4) return data;
      return 'X'.repeat(length - 4) + data.slice(-4);
    } else if (type === 'ifsc') {
      // For IFSC: show last 4 characters, mask the rest
      const length = data.length;
      if (length <= 4) return data;
      return 'X'.repeat(length - 4) + data.slice(-4);
    }
    
    return data;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(API_URL, {
          withCredentials: true, // Include cookies in the request
        });
        setTransactions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError("Failed to fetch transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-24 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Your transaction history will appear here once you start making transfers.
      </p>
    </motion.div>
  );

  const ErrorState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load transactions</h3>
      <p className="text-gray-500 mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition">Try Again</button>
    </motion.div>
  );

  const TransactionCard = ({ txn }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="md:hidden"
    >
      <div className="mb-4 bg-white rounded-2xl shadow hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{txn.recipient}</p>
                <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${txn.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {txn.status === "Success" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />} {txn.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Account: {maskData(txn.accountNumber, 'account')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">IFSC: {maskData(txn.ifsc, 'ifsc')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{txn.purpose}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700">₹{txn.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transaction History
              </h1>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 font-semibold text-gray-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin w-6 h-6 text-blue-600 mr-3" />
              <span className="text-blue-600 font-medium">Loading transactions...</span>
            </div>
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <ErrorState />
        ) : transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow p-6 flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.filter((t) => t.status === "Success").length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {transactions.map((txn) => (
                <TransactionCard key={txn._id} txn={txn} />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
              <div className="p-6 border-b flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold text-lg">Recent Transactions</span>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IFSC Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(txn.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span>{txn.recipient}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-black">{maskData(txn.accountNumber, 'account')}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-black">{maskData(txn.ifsc, 'ifsc')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{txn.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-green-700">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${txn.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {txn.status === "Success" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />} {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
