import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStage,
  getProjectStats,
} from '../controllers/project.controller';

const router = Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/stats', protect, getProjectStats);
router.get('/:id', protect, getProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/stage', protect, updateProjectStage);

export default router;
