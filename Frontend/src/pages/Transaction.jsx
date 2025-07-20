import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  DollarSign,
  Send,
  Zap,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import useContextData from "../hooks/useContextData";
import { useNavigate } from "react-router-dom";

const TransactionPage = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipientAccountNumber: "",
    purpose: "",
    note: "",
  });

  const [useBlockchain, setUseBlockchain] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [chainStatus, setChainStatus] = useState("");
  const [animationStep, setAnimationStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);
  const [myAccountInfo, setMyAccountInfo] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  const { logout } = useAuthStore();
  const { context, handleKeyDown } = useContextData();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current user's account details and balance
  useEffect(() => {
    const fetchMyAccountDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const [accountResponse, balanceResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/my-account", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/transactions/balance", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        if (accountResponse.data.success) {
          setMyAccountInfo(accountResponse.data.accountDetails);
        }
        
        if (balanceResponse.data.success) {
          setCurrentBalance(balanceResponse.data.balance);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };

    fetchMyAccountDetails();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // If recipient account number is entered, fetch recipient details
    if (e.target.name === 'recipientAccountNumber' && e.target.value.length === 12) {
      fetchRecipientDetails(e.target.value);
    } else if (e.target.name === 'recipientAccountNumber' && e.target.value.length !== 12) {
      setRecipientInfo(null);
    }
  };

  const fetchRecipientDetails = async (accountNumber) => {
    if (accountNumber.length !== 12) return;
    
    setIsLoadingRecipient(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/user/${accountNumber}`);
      if (response.data.success) {
        setRecipientInfo(response.data.user);
      } else {
        setRecipientInfo(null);
      }
    } catch (error) {
      console.error('Error fetching recipient details:', error);
      setRecipientInfo(null);
    } finally {
      setIsLoadingRecipient(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    // Check if user has sufficient balance
    if (currentBalance !== null && Number(formData.amount) > currentBalance) {
      setError("Insufficient balance for this transaction");
      toast.error("Insufficient balance for this transaction");
      return;
    }
    
    setIsSubmitting(true);
    setStatus("");
    setError("");
    setTxHash("");
    setChainStatus("");

    try {
      const token = localStorage.getItem("token");
      const endpoint = useBlockchain
        ? "http://localhost:5000/api/transactions/create"
        : "http://localhost:5000/api/transactions";

      // Include context data in the request
      const requestData = {
        ...formData,
        context: context, // Add context data for security evaluation
        useBlockchain: useBlockchain // Include blockchain preference
      };

      const res = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check for risk-based responses
      if (res.data.success === false) {
        if (res.data.message && res.data.message.includes("Suspicious activity")) {
          setError(res.data.message);
          toast.error("Transaction blocked due to suspicious activity. Check your email for details.");
          return;
        } else if (res.data.requireVerification) {
          setError("Additional verification required due to unusual activity. Please check your email for the verification code.");
          toast.success("Verification code sent to your email. Please check and enter the code.");
          navigate("/transaction-verification");
          return;
        }
      }

      setStatus("Transaction Successful");
      setFormData({
        amount: "",
        recipientAccountNumber: "",
        purpose: "",
        note: "",
      });

      if (res?.data?.txHash) {
        setTxHash(res.data.txHash);
        setChainStatus(res.data.chainStatus || "Confirmed");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || "Transaction Failed. Please try again.";
      setError(errorMessage);
      
      // Show appropriate toast messages for different error types
      if (err?.response?.status === 403) {
        toast.error("Transaction blocked for security reasons. Check your email for details.");
      } else if (err?.response?.status === 200 && err?.response?.data?.requireVerification) {
        toast.success("Verification code sent to your email. Please check and enter the code.");
        navigate("/transaction-verification");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          whileHover={{
            scale: 1.08,
            boxShadow: "0 4px 24px rgba(59,130,246,0.15)",
          }}
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
        <div className="flex items-center justify-center text-black">
          <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Make a Transaction
              </h2>
              <p className="text-gray-600">Fill in the details below</p>
            </div>

            {/* Blockchain toggle */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <label
                htmlFor="useBlockchain"
                className="flex items-center gap-2"
              >
                <ShieldCheck className="text-blue-500 w-5 h-5" />
                <span>Secure via Blockchain</span>
              </label>
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={() => setUseBlockchain(!useBlockchain)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Account Number{" "}
                  <span className="text-red-500" title="Required">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  name="recipientAccountNumber"
                  value={formData.recipientAccountNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 123456789012"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 12-digit account number of the recipient
                </p>
                
                {/* Recipient Info Display */}
                {isLoadingRecipient && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-700">Loading recipient details...</span>
                    </div>
                  </div>
                )}
                
                {recipientInfo && !isLoadingRecipient && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Recipient Found</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <p><strong>Name:</strong> {recipientInfo.name}</p>
                      <p><strong>Account:</strong> {recipientInfo.accountNumber}</p>
                      <p><strong>IFSC:</strong> {recipientInfo.ifscCode}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="e.g. Bill Payment / Rent / Gift"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add a note (optional)"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Money</span>
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className="mt-6 flex flex-col space-y-3">
                <div className="flex items-center justify-center text-green-600 gap-2 text-sm bg-green-50 py-3 px-4 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5" />
                  {status}
                </div>
                {useBlockchain && txHash && (
                  <div className="text-xs text-gray-800 break-all bg-gray-100 p-3 rounded-lg border border-gray-200">
                    <div>
                      <strong>Tx Hash:</strong> {txHash}
                    </div>
                    <div>
                      <strong>Status:</strong> {chainStatus}
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center justify-center text-red-600 gap-2 text-sm bg-red-50 py-3 px-4 rounded-xl border border-red-200">
                <XCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* My Account Details */}
            {myAccountInfo && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  My Account Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Name:</span>
                    <span className="font-medium text-blue-900">{myAccountInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Number:</span>
                    <span className="font-mono font-medium text-blue-900">{myAccountInfo.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">IFSC Code:</span>
                    <span className="font-mono font-medium text-blue-900">{myAccountInfo.ifscCode}</span>
                  </div>
                  {currentBalance !== null && (
                    <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                      <span className="text-blue-700 font-semibold">Current Balance:</span>
                      <span className="font-bold text-green-700">₹{currentBalance.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Share these details with others to receive money
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TransactionPage;
