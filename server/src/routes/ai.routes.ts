import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  analyzeProjectController,
  chatController,
  getChatHistory,
} from '../controllers/ai.controller';

const router = Router();

router.post('/analyze-project', protect, analyzeProjectController);
router.post('/chat', protect, chatController);
router.get('/chat/history', protect, getChatHistory);

export default router;
