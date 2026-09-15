import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  searchResourcesController,
  saveResource,
  unsaveResource,
  rateResource,
  getSavedResources,
} from '../controllers/resource.controller';

const router = Router();

router.post('/search', protect, searchResourcesController);
router.get('/saved', protect, getSavedResources);
router.post('/save', protect, saveResource);
router.post('/unsave', protect, unsaveResource);
router.post('/rate', protect, rateResource);

export default router;
