import { Router } from 'express';
import {
  getAllResources,
  searchResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getMyResources
} from '../controllers/resourceController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/search', searchResources);
router.get('/', getAllResources);
router.get('/my', authenticateJWT, getMyResources);
router.get('/:id', getResourceById);

// Protected routes
router.post('/', authenticateJWT, createResource);
router.put('/:id', authenticateJWT, updateResource);
router.delete('/:id', authenticateJWT, deleteResource);

export default router;
