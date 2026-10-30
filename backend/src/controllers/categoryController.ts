import { Request, Response } from 'express';
import { pool } from '../database/db.js';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        c.category_id,
        c.category_name,
        c.description,
        c.icon,
        COUNT(r.resource_id) AS total_resources,
        SUM(CASE WHEN r.availability_status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available_count
       FROM categories c
       LEFT JOIN resources r ON c.category_id = r.category_id
       GROUP BY c.category_id, c.category_name, c.description, c.icon
       ORDER BY c.category_id ASC`
    );

    res.status(200).json({ success: true, count: rows.length, categories: rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
};

export const createCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { category_name, description, icon } = req.body;
    if (!category_name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const [result]: any = await pool.query(
      'INSERT INTO categories (category_name, description, icon) VALUES (?, ?, ?)',
      [category_name, description || null, icon || 'Package']
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category_id: result.insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};
