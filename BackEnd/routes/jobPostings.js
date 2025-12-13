import express from 'express';
import JobPosting from '../models/JobPosting.js';

const router = express.Router();

// Create job posting
router.post('/', async (req, res) => {
  try {
    const job = new JobPosting(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get all job postings
router.get('/', async (req, res) => {
  try {
    const jobs = await JobPosting.find();
    res.status(200).json(jobs); // Make sure this sends a response with job data
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job postings', error: err.message });
  }
});

export default router;
