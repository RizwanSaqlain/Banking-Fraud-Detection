import ServiceRequest from "../models/serviceRequest.model.js";
import User from "../models/user.model.js";

export const createServiceRequest = async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, address, occupation, service } = req.body;
    if (!fullName || !email || !phone || !dateOfBirth || !address || !occupation || !service) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRequest = new ServiceRequest({ fullName, email, phone, dateOfBirth, address, occupation, service });
    await newRequest.save();
    res.status(201).json({ success: true, message: "Service request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyServiceRequests = async (req, res) => {
  try {
    // Use the user's email from the authenticated user
    const user = await User.findById(req.userId);
    const userEmail = user.email;
    if (!userEmail) {
      return res.status(400).json({ error: "User email not found in request." });
    }
    const requests = await ServiceRequest.find({ email: userEmail }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}; 