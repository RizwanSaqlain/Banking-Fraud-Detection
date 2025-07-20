import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Calendar, Save, Edit, ArrowLeft, Home, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/profile" 
  : "/api/profile";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  accountNumber: "",
  ifscCode: "",
  aadhaarNumber: "",
  dob: "",
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState(defaultProfile);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      if (!user?.email) {
        // Wait a bit for user data to load
        setTimeout(() => {
          if (!user?.email) {
            toast.error("Please login to access your profile");
            navigate("/login");
          }
        }, 1000);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}?email=${user.email}`, {
          withCredentials: true
        });
        setProfile(res.data);
        setExists(true);
      } catch (error) {
        if (error.response?.status === 404) {
          // Profile doesn't exist, create with user email
          setProfile(prev => ({ ...prev, email: user.email }));
          setExists(false);
        } else {
          toast.error("Failed to load profile");
          console.error("Profile load error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.post(API_BASE, profile, {
        withCredentials: true
      });
      setExists(true);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put(API_BASE, profile, {
        withCredentials: true
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const calculateCompletion = () => {
    let completion = 0;
    const requiredFields = [
      { name: "fullName", label: "Full Name" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone Number" },
      { name: "address", label: "Address" },
      { name: "accountNumber", label: "Account Number" },
      { name: "ifscCode", label: "IFSC Code" },
      { name: "aadhaarNumber", label: "Aadhaar Number" },
      { name: "dob", label: "Date of Birth" },
    ];

    requiredFields.forEach(field => {
      if (profile[field.name] && profile[field.name].trim() !== "") {
        completion += 100 / requiredFields.length;
      }
    });
    return completion;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
            >
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">
                  {profile.fullName || "Complete Your Profile"}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profile.email || user?.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {exists ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile Created</span>
                    </div>
                  ) : (
                    <div className="text-orange-600 text-sm font-medium">
                      Profile not yet created
                    </div>
                  )}
                </div>
                
                {/* Profile Completion Indicator */}
                {exists && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Profile Completion</span>
                      <span className="font-semibold">{Math.round(calculateCompletion())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${calculateCompletion()}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              {exists && !isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form className="p-8" onSubmit={exists ? handleUpdate : handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                icon={User}
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                disabled={!isEditing && exists}
              />
              
              <FormField
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
                disabled={true} // Email should not be editable
              />
              
              <FormField
                icon={Phone}
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing && exists}
              />
              
              <FormField
                icon={Calendar}
                label="Date of Birth"
                name="dob"
                type="date"
                value={profile.dob}
                onChange={handleChange}
                disabled={!isEditing && exists}
              />
              
              <FormField
                icon={MapPin}
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing && exists}
                fullWidth
              />
              
              <FormField
                icon={CreditCard}
                label="Account Number"
                name="accountNumber"
                value={profile.accountNumber}
                onChange={handleChange}
                disabled={!isEditing && exists}
              />
              
              <FormField
                icon={Shield}
                label="IFSC Code"
                name="ifscCode"
                value={profile.ifscCode}
                onChange={handleChange}
                disabled={!isEditing && exists}
              />
              
              <FormField
                icon={Shield}
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={profile.aadhaarNumber}
                onChange={handleChange}
                disabled={!isEditing && exists}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              {isEditing && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700"
                >
                  Cancel
                </motion.button>
              )}
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {exists ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {exists ? "Update Profile" : "Save Profile"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function FormField({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  fullWidth = false,
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <Icon className="w-4 h-4 text-blue-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
