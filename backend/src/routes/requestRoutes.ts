import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
  cancelRequest
} from '../controllers/requestController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.get('/received', getReceivedRequests);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);

export default router;
