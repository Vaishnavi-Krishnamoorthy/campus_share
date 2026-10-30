import { Router } from 'express';
import {
  getBorrowedItems,
  getLentItems,
  returnResource
} from '../controllers/borrowingController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.get('/borrowed', getBorrowedItems);
router.get('/lent', getLentItems);
router.put('/:id/return', returnResource);

export default router;
