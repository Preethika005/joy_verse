import express from 'express';
import Child from '../models/Child.js';

const router = express.Router();

// Register child
router.post('/', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const newChild = new Child({ name, username, password });
    await newChild.save();
    res.status(201).json({ message: 'Child added successfully' });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ error: 'Failed to add child' });
  }
});

// You can add more child-specific routes here (e.g., get all children)
router.get('/', async (req, res) => {
  try {
    const children = await Child.find();
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

export default router;
