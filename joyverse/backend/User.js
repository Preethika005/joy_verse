// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  username: { type: String, unique: true },
  password: String,
  role: String, // example roles: player, admin, therapist
});
export default mongoose.model("User", userSchema);
