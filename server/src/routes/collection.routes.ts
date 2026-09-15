import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createCollection, deleteCollection, getCollection, getCollections } from '../controllers/collection.controller';

const router = Router();

router.get('/', protect, getCollections);
router.post('/', protect, createCollection);
router.get('/:id', protect, getCollection);
router.delete('/:id', protect, deleteCollection);

export default router;
