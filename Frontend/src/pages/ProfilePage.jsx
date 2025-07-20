import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Calendar, Save, Edit, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-800 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-800 to-violet-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/bankingpage"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Banking</span>
              </Link>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded border border-gray-600 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl hover:bg-gray-700 hover:border-gray-500 hover:text-red-400 font-semibold transition"
            >
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-600">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text">
                  {profile.fullName || "Complete Your Profile"}
                </h1>
                <p className="text-gray-300 mt-1">
                  {profile.email || user?.email}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {exists ? "Profile created" : "Profile not yet created"}
                </p>
                
                {/* Profile Completion Indicator */}
                {exists && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Profile Completion</span>
                      <span>{Math.round(calculateCompletion())}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
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
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-600">
              {isEditing && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </motion.button>
              )}
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg font-semibold transition disabled:opacity-50"
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
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <Icon className="w-4 h-4" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 bg-opacity-50 focus:bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
