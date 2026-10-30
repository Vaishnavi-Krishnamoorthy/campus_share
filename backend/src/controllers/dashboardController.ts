import { Response } from 'express';
import { pool } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { checkAndMarkOverdue } from '../utils/overdueChecker.js';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await checkAndMarkOverdue();
    const student_id = req.user?.student_id;

    // 1. Total resources available system-wide
    const [totalRes]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM resources WHERE availability_status = 'AVAILABLE'"
    );

    // 2. Currently borrowed by this student
    const [currentlyBorrowed]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrowings WHERE borrower_id = ? AND status IN ('ACTIVE', 'OVERDUE')",
      [student_id]
    );

    // 3. Pending requests (both sent by user and received on user's resources)
    const [pendingSent]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrow_requests WHERE borrower_id = ? AND status = 'PENDING'",
      [student_id]
    );
    const [pendingReceived]: any = await pool.query(
      `SELECT COUNT(*) AS count 
       FROM borrow_requests br
       JOIN resources r ON br.resource_id = r.resource_id
       WHERE r.owner_id = ? AND br.status = 'PENDING'`,
      [student_id]
    );

    // 4. Items lent by this student
    const [itemsLent]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrowings WHERE owner_id = ?",
      [student_id]
    );

    // 5. Overdue items for this student
    const [overdueItems]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrowings WHERE borrower_id = ? AND status = 'OVERDUE'",
      [student_id]
    );

    // 6. User's active listings
    const [myListings]: any = await pool.query(
      'SELECT COUNT(*) AS count FROM resources WHERE owner_id = ?',
      [student_id]
    );

    // 7. Recent activity (requests, borrowings)
    const [recentActivity]: any = await pool.query(
      `(SELECT 
          'REQUEST' AS activity_type,
          br.request_date AS activity_date,
          CONCAT('Requested to borrow ', r.resource_name) AS description,
          br.status AS status_badge
        FROM borrow_requests br
        JOIN resources r ON br.resource_id = r.resource_id
        WHERE br.borrower_id = ?
        ORDER BY br.request_date DESC
        LIMIT 5)
       UNION ALL
       (SELECT 
          'BORROWING' AS activity_type,
          b.borrow_date AS activity_date,
          CONCAT('Active loan: ', r.resource_name) AS description,
          b.status AS status_badge
        FROM borrowings b
        JOIN resources r ON b.resource_id = r.resource_id
        WHERE b.borrower_id = ? OR b.owner_id = ?
        ORDER BY b.borrow_date DESC
        LIMIT 5)
       ORDER BY activity_date DESC
       LIMIT 8`,
      [student_id, student_id, student_id]
    );

    res.status(200).json({
      success: true,
      stats: {
        totalResources: totalRes[0].count,
        currentlyBorrowed: currentlyBorrowed[0].count,
        pendingRequests: pendingSent[0].count + pendingReceived[0].count,
        pendingSentCount: pendingSent[0].count,
        pendingReceivedCount: pendingReceived[0].count,
        itemsLent: itemsLent[0].count,
        overdueItems: overdueItems[0].count,
        myListings: myListings[0].count
      },
      recentActivity
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};
