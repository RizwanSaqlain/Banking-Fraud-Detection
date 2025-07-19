import React, { useEffect, useState } from "react";
import axios from "axios";

// Replace with your backend API URL
const API_BASE = "http://localhost:5000/api/profile";

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
  const [profile, setProfile] = useState(defaultProfile);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // -- Here you use the auth email, for this demo use a prompt to get email --
    const getProfile = async () => {
      const email = prompt("Enter your email for profile:");
      if (email) {
        try {
          const res = await axios.get(`${API_BASE}?email=${email}`);
          setProfile(res.data);
          setExists(true);
        } catch {
          setProfile((prev) => ({ ...prev, email }));
          setExists(false);
        }
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, profile);
      setExists(true);
      alert("Profile saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving profile.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API_BASE, profile);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile.");
    }
  };

  if (loading) return null;

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-img">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="36" fill="#EEE" />
              <ellipse cx="36" cy="33" rx="16" ry="15" fill="#BBB" />
              <ellipse cx="36" cy="62" rx="24" ry="14" fill="#CCC" />
            </svg>
          </div>
          <h2>Edit Profile</h2>
          <p className="profile-note">View and update your account details</p>
        </div>
        <form className="profile-form">
          <FormField label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={profile.email} onChange={handleChange} required disabled={exists} />
          <FormField label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
          <FormField label="Address" name="address" value={profile.address} onChange={handleChange} />
          <FormField label="Account Number" name="accountNumber" value={profile.accountNumber} onChange={handleChange} />
          <FormField label="IFSC Code" name="ifscCode" value={profile.ifscCode} onChange={handleChange} />
          <FormField label="Aadhaar Number" name="aadhaarNumber" value={profile.aadhaarNumber} onChange={handleChange} />
          <FormField label="Date of Birth" name="dob" type="date" value={profile.dob} onChange={handleChange} />
          {!exists ? (
            <button className="profile-btn" onClick={handleSave}>Save Profile</button>
          ) : (
            <button className="profile-btn" onClick={handleUpdate}>Update Profile</button>
          )}
        </form>
      </div>
      <style>{`
        .profile-bg {
          min-height: 100vh;
          background: radial-gradient(ellipse 100% 100% at 50% 0%, #594be8 0%, #232456 90%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-card {
          background: #fff;
          max-width: 425px;
          width: 100%;
          border-radius: 1.2rem;
          box-shadow: 0 8px 42px 0 rgba(47, 52, 142, 0.16);
          padding: 2.4rem 2.2rem 2rem 2.2rem;
        }
        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .profile-img {
          margin-bottom: 0.85rem;
        }
        .profile-header h2 {
          margin: 0 0 0.32rem 0;
          color: #23256b;
          font-weight: bold;
          letter-spacing: 0.02em;
        }
        .profile-note {
          font-size: 0.98rem;
          color: #98a2be;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.01rem;
        }
        .profile-btn {
          background: linear-gradient(90deg, #594be8 55%, #6854e3 100%);
          color: #fff;
          border: none;
          font-weight: 600;
          padding: 0.9rem;
          font-size: 1.07rem;
          border-radius: 0.9rem;
          cursor: pointer;
          margin-top: 0.9rem;
        }
        .profile-btn:active {
          background: #4A37B3;
        }
        @media (max-width: 560px) {
          .profile-card { padding: 1.11rem 0.5rem; max-width: 100vw; }
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label style={{ fontWeight: 600, color: "#4b4686", fontSize: ".97rem", marginBottom: "0.125rem", display: "block" }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="profile-input"
        style={{
          width: "100%",
          fontSize: "1rem",
          padding: "0.67rem",
          border: "1.5px solid #DAD9F1",
          borderRadius: "0.55rem",
          background: "#f7f7fc",
          color: "#232456",
          outline: "none",
        }}
      />
    </div>
  );
}
