// Example cursorEvent.route.js
import express from "express";
import CursorEventHandler from "../controller/cursorEvent.controller.js";
const router = express.Router();

router.post("/", CursorEventHandler);

export default router;