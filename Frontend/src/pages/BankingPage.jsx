
import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ShieldCheck, Send, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

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
      {/* Hero Section */}

      <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-violet-700
				 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout
        </motion.button>
      <header className="bg-gradient-to-br from-blue-800 to-violet-900 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">🏦 Welcome to MyBank</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Secure. Smart. Simple. Manage your money with confidence.
        </p>
        <div className="mt-8">
          <Link
            to="/transactions"
            className="inline-flex items-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-blue-100 transition"
          >
            💸 Make a Transaction <ArrowRight className="ml-2" />
          </Link>
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

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center text-sm">
        &copy; {new Date().getFullYear()} MyBank. All rights reserved.
      </footer>
    </div>
  );
};

export default BankingPage;
