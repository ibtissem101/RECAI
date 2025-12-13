const mongoose = require('mongoose');

// Define the schema for a Candidate
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  skills: { type: [String], required: true },
  experienceYears: { type: Number, required: true },
  score: { type: Number, required: true },
  status: { type: String, required: true },
  resumeUrl: { type: String },  // Store resume URL or path
  jobAppliedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
});

// Create the model from the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
