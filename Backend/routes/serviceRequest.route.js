import express from "express";
import { createServiceRequest, getMyServiceRequests } from "../controller/serviceRequest.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", createServiceRequest);
router.get("/my", verifyToken, getMyServiceRequests);

export default router; 