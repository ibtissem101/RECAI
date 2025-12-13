const mongoose = require('mongoose');

// Define the schema for a JobPosting
const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  skillsRequired: { type: [String], required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
});

// Create the model from the schema
const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
