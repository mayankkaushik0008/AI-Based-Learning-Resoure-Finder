import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, (req, res) => {
  res.json({ success: true, data: [], message: 'Recommendations - to be implemented' });
});

router.get('/project/:projectId', protect, (req, res) => {
  res.json({ success: true, data: [], message: 'Project recommendations - to be implemented' });
});

export default router;
