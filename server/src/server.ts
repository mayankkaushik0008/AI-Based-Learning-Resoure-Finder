import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import resourceRoutes from './routes/resource.routes';
import recommendationRoutes from './routes/recommendation.routes';
import learningRoutes from './routes/learning.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import collectionRoutes from './routes/collection.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LearnWise AI Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collections', collectionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 LearnWise AI Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🤖 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
});

export default app;
