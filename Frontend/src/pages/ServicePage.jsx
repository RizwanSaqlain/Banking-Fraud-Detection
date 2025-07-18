import React from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
// import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  CreditCard,
  PiggyBank,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
  Wallet,
  Home,
  Car,
} from "lucide-react";

export default function ServicePage() {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Glucon-D</span>
          </div>
        
          <div className="flex items-center space-x-3">
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">Trusted by 2M+ customers</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Banking Made
            <span className="text-blue-600 block">Simple & Secure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience next-generation banking with our comprehensive suite of financial services. From everyday banking to wealth management, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="text-lg px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="text-lg px-8 py-4 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-transparent hover:bg-blue-50 transition">
              Explore Services
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              FDIC Insured
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              256-bit Encryption
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              4.9/5 Rating
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Banking Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial solutions tailored to meet your personal and business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Personal Banking */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <CreditCard className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Personal Banking</h3>
                <p className="text-gray-500 mb-4">Complete banking solutions for your everyday financial needs</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Checking & Savings Accounts</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Debit & Credit Cards</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Online & Mobile Banking</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-transparent hover:bg-blue-50 transition">Learn More</button>
              </div>
            </div>
            {/* Business Banking */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <Building2 className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Business Banking</h3>
                <p className="text-gray-500 mb-4">Powerful banking tools to help your business grow and succeed</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Business Checking Accounts</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Merchant Services</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Business Loans & Lines of Credit</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-green-600 text-green-600 font-semibold bg-transparent hover:bg-green-50 transition">Learn More</button>
              </div>
            </div>
            {/* Home Loans */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <Home className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Home Loans</h3>
                <p className="text-gray-500 mb-4">Competitive rates and flexible terms for your dream home</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />First-Time Buyer Programs</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Refinancing Options</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Quick Pre-Approval</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-purple-600 text-purple-600 font-semibold bg-transparent hover:bg-purple-50 transition">Learn More</button>
              </div>
            </div>
            {/* Investment Services */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                  <TrendingUp className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Investment Services</h3>
                <p className="text-gray-500 mb-4">Grow your wealth with our expert investment guidance</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Portfolio Management</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Retirement Planning</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Financial Advisory</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-orange-600 text-orange-600 font-semibold bg-transparent hover:bg-orange-50 transition">Learn More</button>
              </div>
            </div>
            {/* Auto Loans */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                  <Car className="w-6 h-6 text-red-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Auto Loans</h3>
                <p className="text-gray-500 mb-4">Drive away with competitive rates and flexible terms</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />New & Used Car Financing</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Refinancing Options</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Fast Approval Process</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-red-600 text-red-600 font-semibold bg-transparent hover:bg-red-50 transition">Learn More</button>
              </div>
            </div>
            {/* Savings & CDs */}
            <div className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                  <PiggyBank className="w-6 h-6 text-teal-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Savings & CDs</h3>
                <p className="text-gray-500 mb-4">Secure your future with high-yield savings and certificates</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />High-Yield Savings</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Certificate of Deposits</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Money Market Accounts</li>
                </ul>
                <button className="w-full py-2 rounded-lg border border-teal-600 text-teal-600 font-semibold bg-transparent hover:bg-teal-50 transition">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our most popular banking solutions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-800">Most Popular</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">SecureBank Premium Account</h3>
              <p className="text-lg text-gray-600 mb-6">
                Experience premium banking with exclusive benefits, higher interest rates, and personalized service.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>No monthly maintenance fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>2.5% APY on savings</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Free ATM access worldwide</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>24/7 premium customer support</span>
                </div>
              </div>
              <button className="mr-4 px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Open Account
              </button>
              <button className="px-8 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-transparent hover:bg-blue-50 transition">
                Learn More
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-bold">SecureBank</h4>
                  <p className="text-blue-100">Premium Account</p>
                </div>
                <Wallet className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm">Account Balance</p>
                  <p className="text-3xl font-bold">$25,847.92</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-100 text-sm">Savings APY</p>
                    <p className="text-xl font-semibold">2.5%</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Rewards Earned</p>
                    <p className="text-xl font-semibold">$247</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Trusted by millions of satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-0 shadow-lg rounded-2xl bg-white p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "SecureBank has transformed how I manage my finances. The mobile app is intuitive and the customer service is exceptional."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <img src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
            </div>

            <div className="border-0 shadow-lg rounded-2xl bg-white p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The investment advisory services helped me plan for retirement effectively. I couldn't be happier with the results."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <img src="/placeholder.svg?height=40&width=40" alt="Michael Chen" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">Engineer</p>
                </div>
              </div>
            </div>

            <div className="border-0 shadow-lg rounded-2xl bg-white p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Getting my home loan was seamless. The team guided me through every step and got me the best rates available."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <img src="/placeholder.svg?height=40&width=40" alt="Emily Rodriguez" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <p className="font-semibold">Emily Rodriguez</p>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join millions of customers who trust SecureBank for their financial needs. Open your account today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Open Account Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="px-8 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent transition">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">We're here to help with all your banking needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center border-0 shadow-lg rounded-2xl bg-white p-8">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with our customer service team</p>
              <p className="text-lg font-semibold text-blue-600">1-800-SECURE-1</p>
              <p className="text-sm text-gray-500">24/7 Support Available</p>
            </div>

            <div className="text-center border-0 shadow-lg rounded-2xl bg-white p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us your questions or concerns</p>
              <p className="text-lg font-semibold text-green-600">support@securebank.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>

            <div className="text-center border-0 shadow-lg rounded-2xl bg-white p-8">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Find a branch or ATM near you</p>
              <p className="text-lg font-semibold text-purple-600">500+ Locations</p>
              <p className="text-sm text-gray-500">Nationwide Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SecureBank</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted financial partner for over 50 years. Banking made simple, secure, and accessible.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>FDIC Insured • Equal Housing Lender</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Personal Banking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Business Banking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Loans & Credit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investment Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find ATM/Branch
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help & FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SecureBank. All rights reserved. Member FDIC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
  