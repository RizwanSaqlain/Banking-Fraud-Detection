import express from 'express';
import { getProfile, createProfile, updateProfile } from '../controller/profile.controller.js';

const router = express.Router();

// GET: fetch profile by email (sent as query param)
router.get('/', getProfile);

// POST: create new profile
router.post('/', createProfile);

// PUT: update profile
router.put('/', updateProfile);

export default router;
