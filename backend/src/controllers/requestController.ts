import { Response } from 'express';
import { pool, withTransaction } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const borrower_id = req.user?.student_id;
    const { resource_id, requested_from, requested_until, purpose, message } = req.body;

    if (!resource_id || !requested_from || !requested_until || !purpose) {
      res.status(400).json({
        success: false,
        message: 'Resource ID, start date, end date, and purpose are required.'
      });
      return;
    }

    if (new Date(requested_until) < new Date(requested_from)) {
      res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date.'
      });
      return;
    }

    // Check resource existence and owner
    const [resourceRows]: any = await pool.query(
      'SELECT owner_id, availability_status, resource_name FROM resources WHERE resource_id = ?',
      [resource_id]
    );

    if (resourceRows.length === 0) {
      res.status(404).json({ success: false, message: 'Resource not found.' });
      return;
    }

    const resource = resourceRows[0];

    if (resource.owner_id === borrower_id) {
      res.status(400).json({
        success: false,
        message: 'You cannot borrow your own resource.'
      });
      return;
    }

    if (resource.availability_status !== 'AVAILABLE') {
      res.status(400).json({
        success: false,
        message: `This resource is currently ${resource.availability_status} and cannot be requested.`
      });
      return;
    }

    // Check if user already has an active PENDING request for this item
    const [existingReq]: any = await pool.query(
      "SELECT request_id FROM borrow_requests WHERE resource_id = ? AND borrower_id = ? AND status = 'PENDING'",
      [resource_id, borrower_id]
    );

    if (existingReq.length > 0) {
      res.status(409).json({
        success: false,
        message: 'You already have a pending borrow request for this resource.'
      });
      return;
    }

    const [result]: any = await pool.query(
      `INSERT INTO borrow_requests 
        (resource_id, borrower_id, requested_from, requested_until, purpose, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [resource_id, borrower_id, requested_from, requested_until, purpose, message || null]
    );

    // Notify resource owner
    await pool.query(
      `INSERT INTO notifications (student_id, title, message, type)
       VALUES (?, 'New Borrow Request', ?, 'REQUEST_RECEIVED')`,
      [
        resource.owner_id,
        `${req.user?.name} requested to borrow your "${resource.resource_name}" until ${requested_until}.`
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Borrow request submitted successfully.',
      request_id: result.insertId
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ success: false, message: 'Failed to create borrow request.' });
  }
};

export const getMyRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const borrower_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT 
        br.request_id,
        br.resource_id,
        br.request_date,
        br.requested_from,
        br.requested_until,
        br.purpose,
        br.message,
        br.status,
        r.resource_name,
        r.image_url AS resource_image,
        r.location AS resource_location,
        s.name AS owner_name,
        s.email AS owner_email,
        s.phone AS owner_phone
      FROM borrow_requests br
      JOIN resources r ON br.resource_id = r.resource_id
      JOIN students s ON r.owner_id = s.student_id
      WHERE br.borrower_id = ?
      ORDER BY br.request_date DESC`,
      [borrower_id]
    );

    res.status(200).json({ success: true, count: rows.length, requests: rows });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your requests.' });
  }
};

export const getReceivedRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const owner_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT 
        br.request_id,
        br.resource_id,
        br.borrower_id,
        br.request_date,
        br.requested_from,
        br.requested_until,
        br.purpose,
        br.message,
        br.status,
        r.resource_name,
        r.image_url AS resource_image,
        r.availability_status AS current_resource_status,
        s.name AS borrower_name,
        s.email AS borrower_email,
        s.department AS borrower_department,
        s.year AS borrower_year,
        s.phone AS borrower_phone,
        s.profile_image AS borrower_avatar
      FROM borrow_requests br
      JOIN resources r ON br.resource_id = r.resource_id
      JOIN students s ON br.borrower_id = s.student_id
      WHERE r.owner_id = ?
      ORDER BY br.request_date DESC`,
      [owner_id]
    );

    res.status(200).json({ success: true, count: rows.length, requests: rows });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch incoming requests.' });
  }
};

/**
 * SECTION 8 REQUIREMENT: ACID Transaction for Approving Borrow Request
 * 1. Lock and check request is PENDING.
 * 2. Lock and check resource is AVAILABLE.
 * 3. Verify caller is the resource owner.
 * 4. Change request status to APPROVED.
 * 5. Change resource status to BORROWED.
 * 6. Create BORROWINGS record.
 * 7. Create notification for borrower.
 * 8. COMMIT transaction.
 * If any step fails: ROLLBACK.
 */
export const approveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const current_user_id = req.user?.student_id;

  try {
    const result = await withTransaction(async (conn) => {
      // Step 1: Lock and select request row
      const [requestRows]: any = await conn.query(
        'SELECT * FROM borrow_requests WHERE request_id = ? FOR UPDATE',
        [id]
      );

      if (requestRows.length === 0) {
        throw { status: 404, message: 'Borrow request not found.' };
      }

      const request = requestRows[0];

      if (request.status !== 'PENDING') {
        throw { status: 400, message: `Cannot approve request with status '${request.status}'.` };
      }

      // Step 2: Lock and select resource row
      const [resourceRows]: any = await conn.query(
        'SELECT * FROM resources WHERE resource_id = ? FOR UPDATE',
        [request.resource_id]
      );

      if (resourceRows.length === 0) {
        throw { status: 404, message: 'Associated resource not found.' };
      }

      const resource = resourceRows[0];

      // Step 3: Verify authorization (only owner can approve)
      if (resource.owner_id !== current_user_id && req.user?.role !== 'ADMIN') {
        throw { status: 403, message: 'Unauthorized. Only the resource owner can approve requests.' };
      }

      if (resource.availability_status !== 'AVAILABLE') {
        throw { status: 400, message: `Resource is currently ${resource.availability_status} and cannot be loaned.` };
      }

      // Step 4: Update request status to APPROVED
      await conn.query(
        "UPDATE borrow_requests SET status = 'APPROVED' WHERE request_id = ?",
        [id]
      );

      // Step 5: Update resource status to BORROWED
      await conn.query(
        "UPDATE resources SET availability_status = 'BORROWED' WHERE resource_id = ?",
        [request.resource_id]
      );

      // Step 6: Create BORROWINGS record
      const [borrowingResult]: any = await conn.query(
        `INSERT INTO borrowings 
          (request_id, resource_id, borrower_id, owner_id, borrow_date, due_date, status)
         VALUES (?, ?, ?, ?, CURDATE(), ?, 'ACTIVE')`,
        [id, request.resource_id, request.borrower_id, resource.owner_id, request.requested_until]
      );

      // Step 7: Create notification for borrower
      await conn.query(
        `INSERT INTO notifications (student_id, title, message, type)
         VALUES (?, 'Request Approved!', ?, 'REQUEST_APPROVED')`,
        [
          request.borrower_id,
          `Your request to borrow "${resource.resource_name}" has been approved! Due date: ${request.requested_until}.`
        ]
      );

      return {
        borrowing_id: borrowingResult.insertId,
        resource_name: resource.resource_name,
        due_date: request.requested_until
      };
    });

    res.status(200).json({
      success: true,
      message: 'Borrow request approved and borrowing created successfully.',
      data: result
    });
  } catch (error: any) {
    console.error('Approve request transaction error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Transaction rolled back. Failed to approve request.'
    });
  }
};

export const rejectRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const current_user_id = req.user?.student_id;

  try {
    const [requestRows]: any = await pool.query(
      `SELECT br.request_id, br.borrower_id, br.status, r.owner_id, r.resource_name
       FROM borrow_requests br
       JOIN resources r ON br.resource_id = r.resource_id
       WHERE br.request_id = ?`,
      [id]
    );

    if (requestRows.length === 0) {
      res.status(404).json({ success: false, message: 'Borrow request not found.' });
      return;
    }

    const request = requestRows[0];

    if (request.owner_id !== current_user_id && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized. Only the owner can reject requests.' });
      return;
    }

    if (request.status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Cannot reject request with status '${request.status}'.` });
      return;
    }

    await pool.query(
      "UPDATE borrow_requests SET status = 'REJECTED' WHERE request_id = ?",
      [id]
    );

    await pool.query(
      `INSERT INTO notifications (student_id, title, message, type)
       VALUES (?, 'Request Declined', ?, 'REQUEST_REJECTED')`,
      [
        request.borrower_id,
        `Your request to borrow "${request.resource_name}" was declined by the owner.`
      ]
    );

    res.status(200).json({ success: true, message: 'Borrow request rejected.' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject request.' });
  }
};

export const cancelRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const borrower_id = req.user?.student_id;

  try {
    const [requestRows]: any = await pool.query(
      'SELECT borrower_id, status FROM borrow_requests WHERE request_id = ?',
      [id]
    );

    if (requestRows.length === 0) {
      res.status(404).json({ success: false, message: 'Borrow request not found.' });
      return;
    }

    if (requestRows[0].borrower_id !== borrower_id) {
      res.status(403).json({ success: false, message: 'Unauthorized. You can only cancel your own requests.' });
      return;
    }

    if (requestRows[0].status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Cannot cancel a request that is already '${requestRows[0].status}'.` });
      return;
    }

    await pool.query(
      "UPDATE borrow_requests SET status = 'CANCELLED' WHERE request_id = ?",
      [id]
    );

    res.status(200).json({ success: true, message: 'Borrow request cancelled successfully.' });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel request.' });
  }
};
