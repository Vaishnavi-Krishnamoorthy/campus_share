import { Request, Response } from 'express';
import { pool } from '../database/db.js';
import { checkAndMarkOverdue } from '../utils/overdueChecker.js';

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    await checkAndMarkOverdue();

    const [students]: any = await pool.query('SELECT COUNT(*) AS count FROM students');
    const [resources]: any = await pool.query('SELECT COUNT(*) AS count FROM resources');
    const [activeBorrowings]: any = await pool.query("SELECT COUNT(*) AS count FROM borrowings WHERE status = 'ACTIVE'");
    const [overdueBorrowings]: any = await pool.query("SELECT COUNT(*) AS count FROM borrowings WHERE status = 'OVERDUE'");
    const [returnedBorrowings]: any = await pool.query("SELECT COUNT(*) AS count FROM borrowings WHERE status = 'RETURNED'");
    const [requests]: any = await pool.query('SELECT COUNT(*) AS count FROM borrow_requests');
    const [categories]: any = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const [reviews]: any = await pool.query('SELECT COUNT(*) AS count, COALESCE(ROUND(AVG(rating), 2), 0) AS avg_rating FROM reviews');

    res.status(200).json({
      success: true,
      stats: {
        totalStudents: students[0].count,
        totalResources: resources[0].count,
        activeLoans: activeBorrowings[0].count,
        overdueLoans: overdueBorrowings[0].count,
        returnedLoans: returnedBorrowings[0].count,
        totalRequests: requests[0].count,
        totalCategories: categories[0].count,
        totalReviews: reviews[0].count,
        systemAvgRating: reviews[0].avg_rating
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

/**
 * DBMS REPORT 1: Most Borrowed Resources (Aggregate JOIN & GROUP BY)
 */
export const getMostBorrowedReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT
        r.resource_id,
        r.resource_name,
        c.category_name,
        s.name AS owner_name,
        COUNT(b.borrowing_id) AS borrow_count
      FROM resources r
      JOIN categories c ON r.category_id = c.category_id
      JOIN students s ON r.owner_id = s.student_id
      LEFT JOIN borrowings b ON r.resource_id = b.resource_id
      GROUP BY r.resource_id, r.resource_name, c.category_name, s.name
      ORDER BY borrow_count DESC
      LIMIT 15;
    `;

    const [rows]: any = await pool.query(query);
    res.status(200).json({ success: true, count: rows.length, data: rows, sql: query.trim() });
  } catch (error) {
    console.error('Most borrowed report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
};

/**
 * DBMS REPORT 2: Resources Distribution by Category (LEFT JOIN & COUNT)
 */
export const getCategoryDistributionReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT
        c.category_id,
        c.category_name,
        COUNT(r.resource_id) AS total_resources,
        SUM(CASE WHEN r.availability_status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available_count,
        SUM(CASE WHEN r.availability_status = 'BORROWED' THEN 1 ELSE 0 END) AS borrowed_count
      FROM categories c
      LEFT JOIN resources r ON c.category_id = r.category_id
      GROUP BY c.category_id, c.category_name
      ORDER BY total_resources DESC;
    `;

    const [rows]: any = await pool.query(query);
    res.status(200).json({ success: true, count: rows.length, data: rows, sql: query.trim() });
  } catch (error) {
    console.error('Category report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate category report.' });
  }
};

/**
 * DBMS REPORT 3: Overdue Resources (JOIN & DATEDIFF Filter)
 */
export const getOverdueReport = async (req: Request, res: Response): Promise<void> => {
  try {
    await checkAndMarkOverdue();

    const query = `
      SELECT
        b.borrowing_id,
        r.resource_name,
        borrower.name AS borrower_name,
        borrower.email AS borrower_email,
        borrower.phone AS borrower_phone,
        owner.name AS owner_name,
        b.borrow_date,
        b.due_date,
        DATEDIFF(CURDATE(), b.due_date) AS days_overdue
      FROM borrowings b
      JOIN resources r ON b.resource_id = r.resource_id
      JOIN students borrower ON b.borrower_id = borrower.student_id
      JOIN students owner ON b.owner_id = owner.student_id
      WHERE b.status = 'OVERDUE' OR (b.status = 'ACTIVE' AND b.due_date < CURDATE())
      ORDER BY days_overdue DESC;
    `;

    const [rows]: any = await pool.query(query);
    res.status(200).json({ success: true, count: rows.length, data: rows, sql: query.trim() });
  } catch (error) {
    console.error('Overdue report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate overdue report.' });
  }
};

/**
 * DBMS DEMO QUERY RUNNER
 * Allows live execution of pre-defined DBMS presentation queries
 */
export const executeDemoQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query_type } = req.body;

    let sql = '';
    let description = '';

    switch (query_type) {
      case 'JOIN_FOUR_TABLES':
        description = '4-Table JOIN combining Borrowings, Resources, Borrowers, and Owners';
        sql = `
          SELECT 
            b.borrowing_id,
            r.resource_name,
            borrower.name AS borrower_name,
            borrower.department AS borrower_dept,
            owner.name AS owner_name,
            b.borrow_date,
            b.due_date,
            b.status
          FROM borrowings b
          JOIN resources r ON b.resource_id = r.resource_id
          JOIN students borrower ON b.borrower_id = borrower.student_id
          JOIN students owner ON b.owner_id = owner.student_id
          ORDER BY b.due_date ASC
          LIMIT 10;
        `;
        break;

      case 'AGGREGATE_METRICS':
        description = 'Aggregate functions (MIN, MAX, AVG) computing borrowing durations';
        sql = `
          SELECT 
            COUNT(*) AS total_loans,
            MIN(DATEDIFF(due_date, borrow_date)) AS min_loan_days,
            MAX(DATEDIFF(due_date, borrow_date)) AS max_loan_days,
            ROUND(AVG(DATEDIFF(due_date, borrow_date)), 1) AS avg_loan_days
          FROM borrowings;
        `;
        break;

      case 'STUDENT_LEADERBOARD':
        description = 'GROUP BY and COUNT calculating student resource sharing and borrowing scores';
        sql = `
          SELECT 
            s.student_id,
            s.name,
            s.department,
            COUNT(DISTINCT r.resource_id) AS items_shared,
            COUNT(DISTINCT b_lent.borrowing_id) AS times_lent,
            COUNT(DISTINCT b_borrowed.borrowing_id) AS times_borrowed
          FROM students s
          LEFT JOIN resources r ON s.student_id = r.owner_id
          LEFT JOIN borrowings b_lent ON s.student_id = b_lent.owner_id
          LEFT JOIN borrowings b_borrowed ON s.student_id = b_borrowed.borrower_id
          WHERE s.role != 'ADMIN'
          GROUP BY s.student_id, s.name, s.department
          ORDER BY items_shared DESC, times_lent DESC
          LIMIT 8;
        `;
        break;

      case 'AVG_RATING_PER_CATEGORY':
        description = 'Category-level average ratings using AVG(), ROUND(), and LEFT JOIN';
        sql = `
          SELECT 
            c.category_name,
            COUNT(DISTINCT r.resource_id) AS total_items,
            COALESCE(ROUND(AVG(rev.rating), 2), 0) AS average_rating
          FROM categories c
          LEFT JOIN resources r ON c.category_id = r.category_id
          LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
          GROUP BY c.category_id, c.category_name
          ORDER BY average_rating DESC;
        `;
        break;

      default:
        res.status(400).json({ success: false, message: 'Invalid demonstration query key.' });
        return;
    }

    const [rows]: any = await pool.query(sql);
    res.status(200).json({
      success: true,
      description,
      sql: sql.trim(),
      rows
    });
  } catch (error) {
    console.error('Execute demo query error:', error);
    res.status(500).json({ success: false, message: 'Failed to execute query.' });
  }
};

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        s.student_id,
        s.name,
        s.email,
        s.student_number,
        s.department,
        s.year,
        s.phone,
        s.role,
        s.created_at,
        COUNT(DISTINCT r.resource_id) AS resources_listed,
        COUNT(DISTINCT b_borrowed.borrowing_id) AS items_borrowed,
        COUNT(DISTINCT b_lent.borrowing_id) AS items_lent
       FROM students s
       LEFT JOIN resources r ON s.student_id = r.owner_id
       LEFT JOIN borrowings b_borrowed ON s.student_id = b_borrowed.borrower_id
       LEFT JOIN borrowings b_lent ON s.student_id = b_lent.owner_id
       GROUP BY s.student_id
       ORDER BY s.student_id ASC`
    );

    res.status(200).json({ success: true, count: rows.length, students: rows });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve students list.' });
  }
};

export const getAllBorrowings = async (req: Request, res: Response): Promise<void> => {
  try {
    await checkAndMarkOverdue();
    const { status } = req.query;

    let sql = `
      SELECT 
        b.borrowing_id,
        b.request_id,
        b.borrow_date,
        b.due_date,
        b.return_date,
        b.status,
        DATEDIFF(b.due_date, CURDATE()) AS days_remaining,
        r.resource_id,
        r.resource_name,
        r.image_url AS resource_image,
        borrower.student_id AS borrower_id,
        borrower.name AS borrower_name,
        borrower.email AS borrower_email,
        borrower.department AS borrower_dept,
        owner.student_id AS owner_id,
        owner.name AS owner_name,
        owner.email AS owner_email
      FROM borrowings b
      JOIN resources r ON b.resource_id = r.resource_id
      JOIN students borrower ON b.borrower_id = borrower.student_id
      JOIN students owner ON b.owner_id = owner.student_id
    `;

    const params: any[] = [];
    if (status) {
      sql += ' WHERE b.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY b.borrow_date DESC';

    const [rows]: any = await pool.query(sql, params);
    res.status(200).json({ success: true, count: rows.length, borrowings: rows });
  } catch (error) {
    console.error('Get all borrowings error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve borrowings ledger.' });
  }
};

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        br.request_id,
        br.resource_id,
        br.borrower_id,
        br.request_date,
        br.requested_from,
        br.requested_until,
        br.purpose,
        br.status,
        r.resource_name,
        borrower.name AS borrower_name,
        borrower.email AS borrower_email,
        owner.name AS owner_name,
        owner.email AS owner_email
      FROM borrow_requests br
      JOIN resources r ON br.resource_id = r.resource_id
      JOIN students borrower ON br.borrower_id = borrower.student_id
      JOIN students owner ON r.owner_id = owner.student_id
      ORDER BY br.request_date DESC`
    );

    res.status(200).json({ success: true, count: rows.length, requests: rows });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve requests.' });
  }
};
