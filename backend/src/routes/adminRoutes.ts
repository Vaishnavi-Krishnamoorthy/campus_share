import { Router } from 'express';
import {
  getAdminStats,
  getMostBorrowedReport,
  getCategoryDistributionReport,
  getOverdueReport,
  executeDemoQuery,
  getAllStudents,
  getAllBorrowings,
  getAllRequests
} from '../controllers/adminController.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/reports/most-borrowed', getMostBorrowedReport);
router.get('/reports/category-summary', getCategoryDistributionReport);
router.get('/reports/overdue', getOverdueReport);
router.post('/demo-query', executeDemoQuery);
router.get('/students', getAllStudents);
router.get('/borrowings', getAllBorrowings);
router.get('/requests', getAllRequests);

export default router;
