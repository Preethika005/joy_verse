import express from 'express';
import Child from '../models/Child.js';
import Therapist from '../models/Therapist.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for therapist
    const therapist = await Therapist.findOne({ username, password });
    if (therapist) {
      return res.json({ role: 'therapist' });
    }

    // Check for child
    const child = await Child.findOne({ username, password });
    if (child) {
      return res.json({ role: 'child' });
    }

    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
