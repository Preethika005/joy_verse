import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Child = mongoose.model('Child', childSchema);  // Ensure collection name is correct
export default Child;
