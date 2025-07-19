import Profile from '../models/profile.model.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.query.email });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'Profile already exists.' });
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { email: req.body.email },        // find by email
      req.body,                         // update with new data
      { new: true, upsert: false }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
