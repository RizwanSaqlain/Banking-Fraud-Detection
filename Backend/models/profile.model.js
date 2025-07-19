import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String },
  address:  { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  aadhaarNumber: { type: String },
  dob:      { type: String }
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
