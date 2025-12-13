import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

// Create candidate
router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  const candidates = await Candidate.find().populate('jobAppliedFor');
  res.json(candidates);
});

export default router;
