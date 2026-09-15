import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import {
  getAdminStats,
  getUsers,
  getResources,
} from '../controllers/admin.controller';

const router = Router();

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getUsers);
router.get('/resources', protect, adminOnly, getResources);

export default router;
