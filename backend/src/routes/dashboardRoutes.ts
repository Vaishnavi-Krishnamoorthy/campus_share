import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, getDashboardStats);

export default router;
