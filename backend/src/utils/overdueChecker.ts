import { pool } from '../database/db.js';

export async function checkAndMarkOverdue(): Promise<number> {
  try {
    // 1. Find newly overdue borrowings
    const [overdueRows]: any = await pool.query(
      `SELECT b.borrowing_id, b.borrower_id, r.resource_name, b.due_date
       FROM borrowings b
       JOIN resources r ON b.resource_id = r.resource_id
       WHERE b.status = 'ACTIVE' AND b.due_date < CURDATE()`
    );

    if (overdueRows.length === 0) {
      return 0;
    }

    // 2. Mark borrowings as OVERDUE
    await pool.query(
      `UPDATE borrowings 
       SET status = 'OVERDUE' 
       WHERE status = 'ACTIVE' AND due_date < CURDATE()`
    );

    // 3. Insert notification for each overdue borrower
    for (const row of overdueRows) {
      await pool.query(
        `INSERT INTO notifications (student_id, title, message, type)
         VALUES (?, ?, ?, 'OVERDUE')`,
        [
          row.borrower_id,
          'Resource Overdue Notice',
          `Your borrowed resource "${row.resource_name}" was due on ${row.due_date} and is now overdue. Please return it to avoid penalty.`
        ]
      );
    }

    return overdueRows.length;
  } catch (error) {
    console.error('Error during overdue checking:', error);
    return 0;
  }
}
