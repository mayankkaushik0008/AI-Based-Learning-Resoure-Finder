import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getLearningPath,
  generateLearningPath,
  completeLearningPathItem,
} from '../controllers/learning.controller';

const router = Router();

router.get('/path/:projectId', protect, getLearningPath);
router.post('/path/:projectId/generate', protect, generateLearningPath);
router.post('/path/item/:itemId/complete', protect, completeLearningPathItem);

export default router;
