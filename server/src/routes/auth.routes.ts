import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
