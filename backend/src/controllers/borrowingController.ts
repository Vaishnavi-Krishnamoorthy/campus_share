import { Response } from 'express';
import { pool, withTransaction } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { checkAndMarkOverdue } from '../utils/overdueChecker.js';

export const getBorrowedItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Run overdue checker first to ensure data accuracy
    await checkAndMarkOverdue();

    const borrower_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT 
        b.borrowing_id,
        b.request_id,
        b.resource_id,
        b.borrow_date,
        b.due_date,
        b.return_date,
        b.status,
        DATEDIFF(b.due_date, CURDATE()) AS days_remaining,
        r.resource_name,
        r.image_url AS resource_image,
        r.location AS resource_location,
        s.student_id AS owner_id,
        s.name AS owner_name,
        s.email AS owner_email,
        s.phone AS owner_phone,
        rev.review_id IS NOT NULL AS is_reviewed,
        rev.rating AS user_rating
      FROM borrowings b
      JOIN resources r ON b.resource_id = r.resource_id
      JOIN students s ON b.owner_id = s.student_id
      LEFT JOIN reviews rev ON b.borrowing_id = rev.borrowing_id
      WHERE b.borrower_id = ?
      ORDER BY 
        CASE 
          WHEN b.status = 'OVERDUE' THEN 1
          WHEN b.status = 'ACTIVE' THEN 2
          ELSE 3
        END,
        b.due_date ASC`,
      [borrower_id]
    );

    res.status(200).json({ success: true, count: rows.length, borrowings: rows });
  } catch (error) {
    console.error('Get borrowed items error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch borrowed items.' });
  }
};

export const getLentItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await checkAndMarkOverdue();

    const owner_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT 
        b.borrowing_id,
        b.request_id,
        b.resource_id,
        b.borrow_date,
        b.due_date,
        b.return_date,
        b.status,
        DATEDIFF(b.due_date, CURDATE()) AS days_remaining,
        r.resource_name,
        r.image_url AS resource_image,
        s.student_id AS borrower_id,
        s.name AS borrower_name,
        s.email AS borrower_email,
        s.department AS borrower_department,
        s.phone AS borrower_phone,
        s.profile_image AS borrower_avatar
      FROM borrowings b
      JOIN resources r ON b.resource_id = r.resource_id
      JOIN students s ON b.borrower_id = s.student_id
      WHERE b.owner_id = ?
      ORDER BY 
        CASE 
          WHEN b.status = 'OVERDUE' THEN 1
          WHEN b.status = 'ACTIVE' THEN 2
          ELSE 3
        END,
        b.borrow_date DESC`,
      [owner_id]
    );

    res.status(200).json({ success: true, count: rows.length, borrowings: rows });
  } catch (error) {
    console.error('Get lent items error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lent items.' });
  }
};

/**
 * SECTION 9 REQUIREMENT: Return Resource with ACID Transaction
 * 1. Lock and check borrowing record.
 * 2. Set return_date = CURDATE().
 * 3. Set borrowing status to RETURNED.
 * 4. Change resource status to AVAILABLE.
 * 5. Create notification for the owner.
 * 6. Commit transaction.
 */
export const returnResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const current_user_id = req.user?.student_id;

  try {
    const result = await withTransaction(async (conn) => {
      // Step 1: Lock borrowing row
      const [borrowingRows]: any = await conn.query(
        'SELECT * FROM borrowings WHERE borrowing_id = ? FOR UPDATE',
        [id]
      );

      if (borrowingRows.length === 0) {
        throw { status: 404, message: 'Borrowing record not found.' };
      }

      const borrowing = borrowingRows[0];

      if (borrowing.status === 'RETURNED') {
        throw { status: 400, message: 'This resource has already been returned.' };
      }

      // Allow either the borrower or the owner (or admin) to register return
      if (borrowing.borrower_id !== current_user_id && borrowing.owner_id !== current_user_id && req.user?.role !== 'ADMIN') {
        throw { status: 403, message: 'Unauthorized. Only the borrower or owner can record a return.' };
      }

      // Step 2 & 3: Update borrowing status to RETURNED with current date
      await conn.query(
        "UPDATE borrowings SET status = 'RETURNED', return_date = CURDATE() WHERE borrowing_id = ?",
        [id]
      );

      // Step 4: Update resource status back to AVAILABLE
      await conn.query(
        "UPDATE resources SET availability_status = 'AVAILABLE' WHERE resource_id = ?",
        [borrowing.resource_id]
      );

      // Fetch resource details for notification
      const [resourceRows]: any = await conn.query(
        'SELECT resource_name FROM resources WHERE resource_id = ?',
        [borrowing.resource_id]
      );
      const resourceName = resourceRows[0]?.resource_name || 'Resource';

      // Step 5: Notify owner that resource was returned
      await conn.query(
        `INSERT INTO notifications (student_id, title, message, type)
         VALUES (?, 'Resource Returned', ?, 'RESOURCE_RETURNED')`,
        [
          borrowing.owner_id,
          `"${resourceName}" has been successfully returned and is now marked AVAILABLE.`
        ]
      );

      // Step 6: Notify borrower to leave a review
      await conn.query(
        `INSERT INTO notifications (student_id, title, message, type)
         VALUES (?, 'Share Your Feedback', ?, 'SYSTEM')`,
        [
          borrowing.borrower_id,
          `You returned "${resourceName}". Please take a moment to rate and review your experience.`
        ]
      );

      return {
        borrowing_id: borrowing.borrowing_id,
        resource_id: borrowing.resource_id,
        status: 'RETURNED'
      };
    });

    res.status(200).json({
      success: true,
      message: 'Resource returned successfully. Availability set to AVAILABLE.',
      data: result
    });
  } catch (error: any) {
    console.error('Return resource transaction error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Transaction rolled back. Failed to process resource return.'
    });
  }
};
