import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  aadhaar: { type: String },
  ifsc: { type: String },
  address: { type: String },
  fatherName: { type: String },
  dob: { type: Date },
  branchName: { type: String },
  // Add more fields as needed
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
