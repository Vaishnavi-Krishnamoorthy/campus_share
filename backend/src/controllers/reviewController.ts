import { Response } from 'express';
import { pool } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reviewer_id = req.user?.student_id;
    const { borrowing_id, rating, comment } = req.body;

    if (!borrowing_id || !rating) {
      res.status(400).json({
        success: false,
        message: 'Borrowing ID and rating (1-5) are required.'
      });
      return;
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.'
      });
      return;
    }

    // Verify that borrowing exists, caller is the borrower, and status is RETURNED
    const [borrowingRows]: any = await pool.query(
      'SELECT * FROM borrowings WHERE borrowing_id = ?',
      [borrowing_id]
    );

    if (borrowingRows.length === 0) {
      res.status(404).json({ success: false, message: 'Borrowing record not found.' });
      return;
    }

    const borrowing = borrowingRows[0];

    if (borrowing.borrower_id !== reviewer_id) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only review resources that you have personally borrowed.'
      });
      return;
    }

    if (borrowing.status !== 'RETURNED') {
      res.status(400).json({
        success: false,
        message: 'You can only review a resource after it has been safely returned.'
      });
      return;
    }

    // Check if review already exists for this borrowing
    const [existingReview]: any = await pool.query(
      'SELECT review_id FROM reviews WHERE borrowing_id = ?',
      [borrowing_id]
    );

    if (existingReview.length > 0) {
      res.status(409).json({
        success: false,
        message: 'You have already submitted a review for this borrowing transaction.'
      });
      return;
    }

    const [result]: any = await pool.query(
      `INSERT INTO reviews (resource_id, reviewer_id, borrowing_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [borrowing.resource_id, reviewer_id, borrowing_id, numericRating, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been recorded.',
      review_id: result.insertId
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Failed to record review.' });
  }
};

export const getResourceReviews = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows]: any = await pool.query(
      `SELECT 
        rev.review_id,
        rev.rating,
        rev.comment,
        rev.created_at,
        s.student_id AS reviewer_id,
        s.name AS reviewer_name,
        s.department AS reviewer_department,
        s.year AS reviewer_year,
        s.profile_image AS reviewer_avatar
      FROM reviews rev
      JOIN students s ON rev.reviewer_id = s.student_id
      WHERE rev.resource_id = ?
      ORDER BY rev.created_at DESC`,
      [id]
    );

    res.status(200).json({ success: true, count: rows.length, reviews: rows });
  } catch (error) {
    console.error('Get resource reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};
