
import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ShieldCheck, Send, ArrowRight } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "../store/authStore";
import { ContextLogTable } from '../components';

const BankingPage = () => {
  const { user, logout } = useAuthStore();

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
    <div className="min-h-screen bg-gray-100">
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
      <header className="bg-gradient-to-br from-blue-800 to-violet-900 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">🏦 Welcome to MyBank</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Secure. Smart. Simple. Manage your money with confidence.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-3 items-center">
          <Link
            to="/transactions"
            className="inline-flex items-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-blue-100 transition"
          >
             Make a Transaction <ArrowRight className="ml-2" />
          </Link>
          <Link to="/service" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium shadow hover:bg-blue-200 transition-all border border-blue-200">Service</Link>
          <Link to="/transaction-history" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium shadow hover:bg-purple-200 transition-all border border-purple-200">Transaction History</Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <Banknote className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instant Payments</h3>
          <p className="text-gray-600">Send and receive money instantly with zero hassle.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <ShieldCheck className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
          <p className="text-gray-600">Your data and funds are protected with industry-grade security.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <Send className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Transfers</h3>
          <p className="text-gray-600">Transfer money to anyone, anytime, anywhere with a few taps.</p>
        </div>
      </section>

      <ContextLogTable logs={user.contextLogs} />

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center text-sm">
        &copy; {new Date().getFullYear()} MyBank. All rights reserved.
      </footer>
    </div>
  );
};

export default BankingPage;
