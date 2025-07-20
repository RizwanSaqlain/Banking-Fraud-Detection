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

const INIT_PROFILE = {
  fullName: "",
  fatherName: "",
  dob: "",
  pan: "",
  aadhaarNumber: "",
  profilePicture: "",
  email: "",
  phone: "",
  address: "",
  accountNumber: "",
  ifscCode: "",
  branch: "",
  accountType: "",
  currentBalance: "",
  accountSince: ""
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState(INIT_PROFILE);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      if (!user?.email) {
        toast.error("Please login to access your profile");
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}?email=${user.email}`, { withCredentials: true });
        setProfile(res.data);
        setExists(true);
      } catch (error) {
        if (error.response?.status === 404) {
          setProfile(prev => ({ ...prev, email: user.email }));
          setExists(false);
        } else {
          toast.error("Failed to load profile");
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
      await axios.post(API_BASE, profile, { withCredentials: true });
      setExists(true);
      setIsEditing(false);
      toast.success("Profile created");
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
      await axios.put(API_BASE, profile, { withCredentials: true });
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    let filled = 0;
    const required = ["fullName", "email", "phone", "accountNumber", "ifscCode", "aadhaarNumber", "dob", "address"];
    required.forEach(field => {
      if (profile[field] && profile[field].trim() !== "") filled++;
    });
    return Math.round((filled / required.length) * 100);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
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
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}

              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>


      <div className="relative z-10 max-w-4xl mx-auto py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-blue-500 shadow-2xl"
        >
          {/* Profile Summary */}
          <div className="p-8 border-b border-blue-800">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {profile.fullName || "Complete Your Profile"}
                </h1>
                <p className="text-blue-200">{profile.email || user?.email}</p>
                <p className="text-sm text-blue-300">
                  {exists ? "Profile loaded" : "New profile"}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-blue-200 mb-1">
                    <span>Profile Completion</span>
                    <span>{calculateCompletion()}%</span>

                  </div>
                  <div className="w-full bg-blue-900 border border-blue-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-400 h-2" style={{ width: `${calculateCompletion()}%` }}></div>
                  </div>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"

                >
                  <Edit className="inline-block mr-1 w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={exists ? handleUpdate : handleSave}>
            <FormField label="Full Name" name="fullName" icon={User} value={profile.fullName} onChange={handleChange} disabled={!isEditing} />
            <FormField type="email" label="Email" name="email" icon={Mail} value={profile.email} onChange={handleChange} disabled={true} />
            <FormField label="Phone" name="phone" icon={Phone} value={profile.phone} onChange={handleChange} disabled={!isEditing} />
            <FormField type="date" label="DOB" name="dob" icon={Calendar} value={profile.dob} onChange={handleChange} disabled={!isEditing} />
            <FormField label="Address" name="address" icon={MapPin} value={profile.address} onChange={handleChange} disabled={!isEditing} />
            <FormField label="Account Number" name="accountNumber" icon={CreditCard} value={profile.accountNumber} onChange={handleChange} disabled={!isEditing} />
            <FormField label="IFSC Code" name="ifscCode" icon={Shield} value={profile.ifscCode} onChange={handleChange} disabled={!isEditing} />
            <FormField label="Aadhaar Number" name="aadhaarNumber" icon={Shield} value={profile.aadhaarNumber} onChange={handleChange} disabled={!isEditing} />

            {/* Buttons */}
            <div className="col-span-full mt-8 flex gap-4">
              {isEditing && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-blue-500 rounded hover:bg-blue-700">

                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded"

              >
                {saving ? "Saving..." : exists ? "Update Profile" : "Save Profile"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function FormField({ label, name, value, icon: Icon, onChange, disabled = false, type = "text" }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-blue-200 mb-1">
        <Icon className="w-4 h-4" />
        {label}

      </label>
      <input
        type={type}
        name={name}
        className="w-full px-4 py-2 rounded bg-blue-950 text-white border border-blue-700 placeholder-blue-300 disabled:opacity-50"
        placeholder={`Enter ${label}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
