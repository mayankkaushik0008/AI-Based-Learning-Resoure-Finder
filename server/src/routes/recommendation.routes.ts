import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getGeneralRecommendations, getProjectRecommendations } from '../controllers/recommendation.controller';

const router = Router();

router.get('/', protect, getGeneralRecommendations);
router.get('/project/:projectId', protect, getProjectRecommendations);

export default router;
