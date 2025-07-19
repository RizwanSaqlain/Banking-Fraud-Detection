
import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ShieldCheck, Send, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "../store/authStore";
import { ContextLogTable, Navbar } from '../components';

const BankingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
 
        <header className="bg-gradient-to-br from-blue-800 to-violet-900 text-white py-20 px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">🏦 Welcome to MyBank</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Secure. Smart. Simple. Manage your money with confidence.
          </p>
         
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
