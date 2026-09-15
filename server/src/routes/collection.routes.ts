import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, (req, res) => {
  res.json({ success: true, data: [], message: 'Collections - to be implemented' });
});

router.post('/', protect, (req, res) => {
  res.json({ success: true, message: 'Create collection - to be implemented' });
});

router.get('/:id', protect, (req, res) => {
  res.json({ success: true, message: 'Get collection - to be implemented' });
});

router.delete('/:id', protect, (req, res) => {
  res.json({ success: true, message: 'Delete collection - to be implemented' });
});

export default router;
