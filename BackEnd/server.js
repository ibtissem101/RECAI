import express from 'express';
import connectDB from './db.js';

import jobPostingsRoutes from './routes/jobPostings.js';
import candidateRoutes from './routes/candidates.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = 5000;

app.use(express.json());

connectDB();

app.use('/api/jobPostings', jobPostingsRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
