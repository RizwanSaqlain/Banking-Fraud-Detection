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

const TransactionPage = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    accountNumber: "",
    ifsc: "",
    purpose: "",
    note: "",
  });

  const [useBlockchain, setUseBlockchain] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [chainStatus, setChainStatus] = useState("");
  const [animationStep, setAnimationStep] = useState(0);

  const { logout } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setTxHash("");
    setChainStatus("");

    try {
      const token = localStorage.getItem("token");
      const endpoint = useBlockchain
        ? "http://localhost:5000/api/transactions/create"
        : "http://localhost:5000/api/transactions";

      const res = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("Transaction Successful");
      setFormData({
        amount: "",
        recipient: "",
        accountNumber: "",
        ifsc: "",
        purpose: "",
        note: "",
      });

      if (res?.data?.txHash) {
        setTxHash(res.data.txHash);
        setChainStatus(res.data.chainStatus || "Confirmed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || "Transaction Failed. Please try again."
      );
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name{" "}
                  <span className="text-red-500" title="Required">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1234567890"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SBIN0001234"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                />
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Money</span>
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
