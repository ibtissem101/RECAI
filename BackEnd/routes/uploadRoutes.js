import express from 'express';
import multer from 'multer';
import path from 'path';
import { processAndRankResumes } from '../services/resumeParser.js';

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Upload & process resumes
router.post('/upload', upload.array('resumes'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { jobSkills = [] } = req.body;

    const result = await processAndRankResumes(req.files, jobSkills);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Resume processing failed' });
  }
});

export default router;
