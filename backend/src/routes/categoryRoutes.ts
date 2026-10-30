import { Router } from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authenticateJWT, requireAdmin, createCategory);

export default router;
