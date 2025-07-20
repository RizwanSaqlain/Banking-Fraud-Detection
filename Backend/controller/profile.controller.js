import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      profile = await Profile.create({ user: req.userId });
    }

    const profileObj = profile.toObject();
    profileObj.name = user.name;
    profileObj.email = user.email;
    res.json(profileObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      profile = await Profile.create({ user: req.userId });
    }
    // Only update fields that are not name/email
    const { aadhaar, ifsc, address, fatherName, dob, branchName } = req.body;
    if (aadhaar !== undefined) profile.aadhaar = aadhaar;
    if (ifsc !== undefined) profile.ifsc = ifsc;
    if (address !== undefined) profile.address = address;
    if (fatherName !== undefined) profile.fatherName = fatherName;
    if (dob !== undefined) profile.dob = dob;
    if (branchName !== undefined) profile.branchName = branchName;
    await profile.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
