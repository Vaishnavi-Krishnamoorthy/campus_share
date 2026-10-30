import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AuthPayload, Student } from '../types/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ success: false, message: 'Authentication is not configured.' });
      return;
    }

    const { name, email, password, student_number, department, year, phone } = req.body;

    if (!name || !email || !password || !student_number || !department || !year) {
      res.status(400).json({
        success: false,
        message: 'Name, email, password, student number, department, and year are required.'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    // Check email or student number uniqueness
    const [existing]: any = await pool.query(
      'SELECT student_id, email, student_number FROM students WHERE email = ? OR student_number = ?',
      [email, student_number]
    );

    if (existing.length > 0) {
      if (existing[0].email === email) {
        res.status(409).json({ success: false, message: 'Email address is already registered.' });
        return;
      }
      if (existing[0].student_number === student_number) {
        res.status(409).json({ success: false, message: 'Student ID number is already registered.' });
        return;
      }
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result]: any = await pool.query(
      `INSERT INTO students (name, email, password_hash, student_number, department, year, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, student_number, department, parseInt(year, 10), phone || null]
    );

    const newStudentId = result.insertId;

    // Send welcome notification
    await pool.query(
      `INSERT INTO notifications (student_id, title, message, type)
       VALUES (?, 'Welcome to CampusShare!', 'Your account has been created. Start browsing resources or list your own.', 'SYSTEM')`,
      [newStudentId]
    );

    const payload: AuthPayload = {
      student_id: newStudentId,
      name,
      email,
      student_number,
      department,
      role: 'STUDENT'
    };

    const token = jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      token,
      user: payload
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed due to a server error.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ success: false, message: 'Authentication is not configured.' });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const [rows]: any = await pool.query(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const student: Student = rows[0];
    const isMatch = await bcrypt.compare(password, student.password_hash || '');

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const payload: AuthPayload = {
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      student_number: student.student_number,
      department: student.department,
      role: student.role
    };

    const token = jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        ...payload,
        year: student.year,
        phone: student.phone,
        profile_image: student.profile_image
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed due to a server error.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT student_id, name, email, student_number, department, year, phone, profile_image, role, created_at
       FROM students WHERE student_id = ?`,
      [student_id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    // Also get activity counts
    const [resourceCount]: any = await pool.query(
      'SELECT COUNT(*) AS count FROM resources WHERE owner_id = ?',
      [student_id]
    );
    const [borrowedCount]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrowings WHERE borrower_id = ? AND status IN ('ACTIVE', 'OVERDUE')",
      [student_id]
    );
    const [lentCount]: any = await pool.query(
      "SELECT COUNT(*) AS count FROM borrowings WHERE owner_id = ? AND status = 'RETURNED'",
      [student_id]
    );

    res.status(200).json({
      success: true,
      user: {
        ...rows[0],
        total_listed_resources: resourceCount[0].count,
        currently_borrowed_count: borrowedCount[0].count,
        items_lent_count: lentCount[0].count
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student profile.' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student_id = req.user?.student_id;
    const { name, phone, department, year, profile_image } = req.body;

    await pool.query(
      `UPDATE students 
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           department = COALESCE(?, department),
           year = COALESCE(?, year),
           profile_image = COALESCE(?, profile_image)
       WHERE student_id = ?`,
      [name, phone, department, year ? parseInt(year, 10) : null, profile_image, student_id]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
