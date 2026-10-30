import { Router } from 'express';
import { createReview, getResourceReviews } from '../controllers/reviewController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/resource/:id', getResourceReviews);
router.post('/', authenticateJWT, createReview);

export default router;
