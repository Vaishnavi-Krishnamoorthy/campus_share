import { Response } from 'express';
import { pool } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT notification_id, title, message, type, is_read, created_at
       FROM notifications
       WHERE student_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [student_id]
    );

    const [unreadCount]: any = await pool.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE student_id = ? AND is_read = FALSE',
      [student_id]
    );

    res.status(200).json({
      success: true,
      unread_count: unreadCount[0].count,
      notifications: rows
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student_id = req.user?.student_id;

    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND student_id = ?',
      [id, student_id]
    );

    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student_id = req.user?.student_id;

    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE student_id = ?',
      [student_id]
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};
