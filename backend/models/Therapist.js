import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Therapist = mongoose.model('Therapist', therapistSchema);
export default Therapist;
