import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

const RESEND_TIMEOUT = 60; // seconds

const TransactionVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuthStore();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async () => {
    try {
      toast.success("Please try the transaction again to receive a new code!");
      setTimer(RESEND_TIMEOUT);
      setCanResend(false);
      navigate("/transactions");
    } catch (err) {
      toast.error("Failed to resend code.");
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedValue = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedValue[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value.slice(0, 1); // Allow only one character
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions/verify",
        { verificationCode },
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        toast.success("Transaction verified and completed successfully!");
        navigate("/transaction-history");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      const errorMessage =
        error.response?.data?.error || "Verification failed. Please try again.";
      toast.error(errorMessage);

      // Clear the code on error
      setCode(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //   Auto Submit when all inputs are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="min-h-screen w-full pt-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Transaction Verification
            </h2>
            <p className="text-gray-600">
              Enter the verification code sent to your email to complete the
              transaction.
            </p>
          </div>
          <p className="text-center mb-6 text-blue-600 font-medium">
            Check your email for the 6-digit code
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => {
                    handleChange(index, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown(index, e);
                  }}
                  className="w-12 h-12 text-center text-2xl bg-gray-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                {canResend
                  ? "Didn't receive the code?"
                  : `Resend available in ${timer}s`}
              </span>
              <button
                type="button"
                className={`ml-2 text-blue-600 font-semibold hover:underline disabled:text-gray-400`}
                onClick={handleResend}
                disabled={!canResend}
              >
                Resend
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
              type="submit"
              disabled={isSubmitting || code.some((digit) => !digit)}
            >
              {isSubmitting ? "Verifying..." : "Verify Transaction"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/transactions")}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Back to Transactions
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionVerificationPage;
