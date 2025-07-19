import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Users, 
  Building, 
  Smartphone, 
  Globe, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  LogOut,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  X,
  User,
  Calendar,
  FileText,
  Home,
  
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const ServicePage = () => {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const openServiceForm = (service) => {
    setSelectedService(service);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      occupation: "",
      monthlyIncome: "",
      purpose: "",
      additionalInfo: ""
    });
    setIsModalOpen(true);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const updateField = (fieldName, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldName]: value
      };
      return newData;
    });
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({});
  };



  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea' && e.target.type !== 'submit') {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'dateOfBirth', 'address', 'occupation'];
    const errors = [];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${selectedService.name} application submitted successfully! We'll contact you soon.`);
      closeModal();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceSpecificFields = () => {
    if (!selectedService) return [];

    const fieldMappings = {
      "Online Banking": [
        { name: "accountType", label: "Account Type", type: "select", options: ["Savings", "Current", "Salary"] },
        { name: "branchPreference", label: "Preferred Branch", type: "text" }
      ],
      "Mobile Banking": [
        { name: "deviceType", label: "Device Type", type: "select", options: ["Android", "iOS", "Both"] },
        { name: "existingAccount", label: "Existing Account Number", type: "text" }
      ],
      "Credit Cards": [
        { name: "cardType", label: "Card Type", type: "select", options: ["Rewards", "Travel", "Shopping", "Premium"] },
        { name: "creditLimit", label: "Desired Credit Limit", type: "select", options: ["₹50,000", "₹1,00,000", "₹2,00,000", "₹5,00,000+"] }
      ],
      "Personal Loans": [
        { name: "loanAmount", label: "Loan Amount Required", type: "select", options: ["₹50,000 - ₹1,00,000", "₹1,00,000 - ₹5,00,000", "₹5,00,000 - ₹10,00,000", "₹10,00,000+"] },
        { name: "loanPurpose", label: "Loan Purpose", type: "select", options: ["Home Renovation", "Education", "Medical", "Business", "Wedding", "Other"] },
        { name: "tenure", label: "Preferred Tenure", type: "select", options: ["12 months", "24 months", "36 months", "48 months", "60 months"] }
      ],
      "Investment Services": [
        { name: "investmentType", label: "Investment Type", type: "select", options: ["Mutual Funds", "Fixed Deposits", "Insurance", "Wealth Management"] },
        { name: "investmentAmount", label: "Investment Amount", type: "select", options: ["₹10,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹5,00,000", "₹5,00,000+"] },
        { name: "riskProfile", label: "Risk Profile", type: "select", options: ["Conservative", "Moderate", "Aggressive"] }
      ],
      "Business Banking": [
        { name: "businessType", label: "Business Type", type: "select", options: ["Sole Proprietorship", "Partnership", "Private Limited", "Public Limited", "LLP"] },
        { name: "businessAge", label: "Business Age (Years)", type: "select", options: ["0-1", "1-3", "3-5", "5-10", "10+"] },
        { name: "annualTurnover", label: "Annual Turnover", type: "select", options: ["< ₹10 Lakhs", "₹10-50 Lakhs", "₹50 Lakhs - 1 Crore", "₹1-5 Crores", "₹5+ Crores"] }
      ],
      "Insurance": [
        { name: "insuranceType", label: "Insurance Type", type: "select", options: ["Life Insurance", "Health Insurance", "Motor Insurance", "Home Insurance"] },
        { name: "coverageAmount", label: "Coverage Amount", type: "select", options: ["₹5 Lakhs", "₹10 Lakhs", "₹25 Lakhs", "₹50 Lakhs", "₹1 Crore+"] },
        { name: "familyMembers", label: "Number of Family Members", type: "select", options: ["1", "2-3", "4-5", "6+"] }
      ],
      "NRI Services": [
        { name: "countryOfResidence", label: "Country of Residence", type: "text" },
        { name: "nriType", label: "NRI Type", type: "select", options: ["NRI", "PIO", "OCI"] },
        { name: "remittanceFrequency", label: "Remittance Frequency", type: "select", options: ["Monthly", "Quarterly", "Yearly", "As Needed"] }
      ]
    };

    return fieldMappings[selectedService.name] || [];
  };

  const services = [
    {
      id: 1,
      name: "Online Banking",
      description: "Access your accounts 24/7 with secure online banking. Transfer funds, pay bills, and manage your finances from anywhere.",
      icon: Globe,
      category: "digital",
      features: ["24/7 Account Access", "Real-time Balance", "Transaction History", "Bill Payments"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      name: "Mobile Banking",
      description: "Bank on the go with our mobile app. Send money, check balances, and manage your accounts with just a tap.",
      icon: Smartphone,
      category: "digital",
      features: ["Mobile Transfers", "QR Payments", "Biometric Login", "Push Notifications"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 3,
      name: "Credit Cards",
      description: "Choose from our range of credit cards with competitive interest rates, rewards programs, and exclusive benefits.",
      icon: CreditCard,
      category: "cards",
      features: ["Rewards Points", "Cashback", "Travel Insurance", "Zero Annual Fee"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 4,
      name: "Personal Loans",
      description: "Quick and easy personal loans for your needs. Competitive rates and flexible repayment options.",
      icon: DollarSign,
      category: "loans",
      features: ["Quick Approval", "Flexible Tenure", "Low Interest Rates", "No Hidden Charges"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: 5,
      name: "Investment Services",
      description: "Grow your wealth with our investment products. Expert guidance and diverse investment options.",
      icon: TrendingUp,
      category: "investment",
      features: ["Mutual Funds", "Fixed Deposits", "Insurance", "Wealth Management"],
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      id: 6,
      name: "Business Banking",
      description: "Comprehensive banking solutions for businesses. From startups to enterprises, we've got you covered.",
      icon: Building,
      category: "business",
      features: ["Business Accounts", "Trade Finance", "Working Capital", "Digital Solutions"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: 7,
      name: "Insurance",
      description: "Protect what matters most with our comprehensive insurance products. Life, health, and general insurance.",
      icon: Shield,
      category: "insurance",
      features: ["Life Insurance", "Health Insurance", "Motor Insurance", "Home Insurance"],
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      id: 8,
      name: "NRI Services",
      description: "Specialized banking services for Non-Resident Indians. Manage your Indian finances from anywhere in the world.",
      icon: Users,
      category: "nri",
      features: ["NRI Accounts", "Remittance Services", "Investment Options", "Tax Advisory"],
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  const categories = [
    { id: "all", name: "All Services", count: services.length },
    { id: "digital", name: "Digital Banking", count: services.filter(s => s.category === "digital").length },
    { id: "cards", name: "Cards", count: services.filter(s => s.category === "cards").length },
    { id: "loans", name: "Loans", count: services.filter(s => s.category === "loans").length },
    { id: "investment", name: "Investment", count: services.filter(s => s.category === "investment").length },
    { id: "business", name: "Business", count: services.filter(s => s.category === "business").length },
    { id: "insurance", name: "Insurance", count: services.filter(s => s.category === "insurance").length },
    { id: "nri", name: "NRI Services", count: services.filter(s => s.category === "nri").length }
  ];

  const filteredServices = activeTab === "all" 
    ? services 
    : services.filter(service => service.category === activeTab);

  const ServiceCard = ({ service }) => {
    const IconComponent = service.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`${service.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openServiceForm(service)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
        
        <div className="space-y-2">
          {service.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openServiceForm(service)}
          className={`mt-6 w-full bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}
        >
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  };

  const ApplicationModal = () => {
    if (!selectedService) return null;

    const IconComponent = selectedService.icon;
    const specificFields = getServiceSpecificFields();

    return (
      <>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${selectedService.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                      <p className="text-gray-600">Application Form</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6 text-black">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                                             <input
                         type="text"
                         name="fullName"
                         value={formData.fullName || ""}
                         onChange={(e) => handleFieldChange('fullName', e.target.value)}
                         required
                         className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                         placeholder="Enter your full name"
                       />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                                             <input
                         type="email"
                         name="email"
                         value={formData.email || ""}
                         onChange={handleInputChange}
                         required
                         className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                         placeholder="Enter your email"
                       />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                                             <input
                         type="tel"
                         name="phone"
                         value={formData.phone || ""}
                         onChange={handleInputChange}
                         required
                         className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                         placeholder="Enter your phone number"
                       />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                                             <input
                         type="date"
                         name="dateOfBirth"
                         value={formData.dateOfBirth || ""}
                         onChange={handleInputChange}
                         required
                         className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                       />
                    </div>
                  </div>
                </div>

                {/* Address & Occupation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Address & Occupation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                                             <textarea
                         name="address"
                         value={formData.address || ""}
                         onChange={handleInputChange}
                         required
                         rows={3}
                         className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-black placeholder-gray-500"
                         placeholder="Enter your complete address"
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation <span className="text-red-500">*</span>
                        </label>
                                                 <input
                           type="text"
                           name="occupation"
                           value={formData.occupation || ""}
                           onChange={handleInputChange}
                           required
                           className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                           placeholder="Enter your occupation"
                         />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Income
                        </label>
                                                 <select
                           name="monthlyIncome"
                           value={formData.monthlyIncome || ""}
                           onChange={handleInputChange}
                           className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                         >
                          <option value="">Select income range</option>
                          <option value="< ₹25,000">Less than ₹25,000</option>
                          <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                          <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                          <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                          <option value="> ₹2,00,000">More than ₹2,00,000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Specific Fields */}
                {specificFields.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Service Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specificFields.map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                                                         <select
                               name={field.name}
                               value={formData[field.name] || ""}
                               onChange={handleInputChange}
                               className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                             >
                              <option value="">Select {field.label.toLowerCase()}</option>
                              {field.options.map((option, optIndex) => (
                                <option key={optIndex} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                                                         <input
                               type="text"
                               name={field.name}
                               value={formData[field.name] || ""}
                               onChange={handleInputChange}
                               className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                               placeholder={`Enter ${field.label.toLowerCase()}`}
                             />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                                     <textarea
                     name="additionalInfo"
                     value={formData.additionalInfo || ""}
                     onChange={handleInputChange}
                     rows={3}
                     className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-black placeholder-gray-500"
                     placeholder="Any additional information or specific requirements..."
                   />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedService.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Banking Services
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Comprehensive Banking Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover our wide range of banking services designed to meet all your financial needs. 
            From digital banking to investment solutions, we're here to help you succeed.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.name}
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 text-lg">Our customer support team is here to assist you 24/7</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
              <p className="text-gray-600">1800-123-4567</p>
              <p className="text-sm text-gray-500">24/7 Support</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600">support@bank.com</p>
              <p className="text-sm text-gray-500">Quick Response</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600">Find Nearest Branch</p>
              <p className="text-sm text-gray-500">Locate ATM/Branch</p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure Banking</h4>
            <p className="text-gray-600 text-sm">Bank-level security with encryption and fraud protection</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">24/7 Access</h4>
            <p className="text-gray-600 text-sm">Access your accounts anytime, anywhere</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Premium Service</h4>
            <p className="text-gray-600 text-sm">Dedicated support and personalized solutions</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Privacy First</h4>
            <p className="text-gray-600 text-sm">Your data is protected with industry-leading security</p>
          </motion.div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal />
    </div>
  );
};

export default ServicePage;
