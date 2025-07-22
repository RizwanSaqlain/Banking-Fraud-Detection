import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import profileRoutes from "./routes/profile.route.js";
import serviceRequestRoutes from "./routes/serviceRequest.route.js";
import cursorEventRoutes from "./routes/cursorEvent.route.js";
import connectDB from "./db/connectDB.js";
import CursorEvent from './models/cursorTrack.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '5mb' })); // Increase limit to 5MB
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
  })
);

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/service-requests", serviceRequestRoutes);

// POST route to save cursor movement event
app.use('/api/cursor-events', cursorEventRoutes);

app.get('/api/cursor-events/all', async (req, res) => {
  const events = await CursorEvent.find({});
  res.json(events);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
