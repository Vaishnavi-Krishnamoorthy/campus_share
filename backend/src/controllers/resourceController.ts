import { Request, Response } from 'express';
import { pool } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAllResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, condition, availability, department, sort } = req.query;

    let sql = `
      SELECT 
        r.resource_id,
        r.resource_name,
        r.description,
        r.condition,
        r.availability_status,
        r.image_url,
        r.location,
        r.created_at,
        c.category_id,
        c.category_name,
        s.student_id AS owner_id,
        s.name AS owner_name,
        s.department AS owner_department,
        s.profile_image AS owner_avatar,
        COALESCE(ROUND(AVG(rev.rating), 1), 5.0) AS avg_rating,
        COUNT(rev.review_id) AS total_reviews
      FROM resources r
      JOIN students s ON r.owner_id = s.student_id
      JOIN categories c ON r.category_id = c.category_id
      LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (category) {
      sql += ' AND (c.category_name = ? OR c.category_id = ?)';
      params.push(category, category);
    }
    if (condition) {
      sql += ' AND r.condition = ?';
      params.push(condition);
    }
    if (availability) {
      sql += ' AND r.availability_status = ?';
      params.push(availability);
    }
    if (department) {
      sql += ' AND s.department = ?';
      params.push(department);
    }

    sql += ' GROUP BY r.resource_id, s.student_id, c.category_id';

    if (sort === 'rating') {
      sql += ' ORDER BY avg_rating DESC';
    } else if (sort === 'name') {
      sql += ' ORDER BY r.resource_name ASC';
    } else {
      sql += ' ORDER BY r.created_at DESC';
    }

    const [rows]: any = await pool.query(sql, params);
    res.status(200).json({ success: true, count: rows.length, resources: rows });
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resources.' });
  }
};

export const searchResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = (req.query.q as string) || '';
    const { category, condition, availability, department } = req.query;

    const searchTerm = `%${q}%`;

    let sql = `
      SELECT 
        r.resource_id,
        r.resource_name,
        r.description,
        r.condition,
        r.availability_status,
        r.image_url,
        r.location,
        r.created_at,
        c.category_id,
        c.category_name,
        s.student_id AS owner_id,
        s.name AS owner_name,
        s.department AS owner_department,
        COALESCE(ROUND(AVG(rev.rating), 1), 5.0) AS avg_rating,
        COUNT(rev.review_id) AS total_reviews
      FROM resources r
      JOIN students s ON r.owner_id = s.student_id
      JOIN categories c ON r.category_id = c.category_id
      LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
      WHERE (r.resource_name LIKE ? OR r.description LIKE ? OR c.category_name LIKE ? OR s.department LIKE ?)
    `;

    const params: any[] = [searchTerm, searchTerm, searchTerm, searchTerm];

    if (category) {
      sql += ' AND (c.category_name = ? OR c.category_id = ?)';
      params.push(category, category);
    }
    if (condition) {
      sql += ' AND r.condition = ?';
      params.push(condition);
    }
    if (availability) {
      sql += ' AND r.availability_status = ?';
      params.push(availability);
    }
    if (department) {
      sql += ' AND s.department = ?';
      params.push(department);
    }

    sql += ' GROUP BY r.resource_id, s.student_id, c.category_id ORDER BY r.resource_name ASC';

    const [rows]: any = await pool.query(sql, params);
    res.status(200).json({ success: true, count: rows.length, resources: rows });
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({ success: false, message: 'Resource search failed.' });
  }
};

export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [resourceRows]: any = await pool.query(
      `SELECT 
        r.resource_id,
        r.owner_id,
        r.category_id,
        r.resource_name,
        r.description,
        r.condition,
        r.availability_status,
        r.image_url,
        r.location,
        r.created_at,
        r.updated_at,
        c.category_name,
        s.name AS owner_name,
        s.email AS owner_email,
        s.department AS owner_department,
        s.year AS owner_year,
        s.phone AS owner_phone,
        s.profile_image AS owner_avatar
      FROM resources r
      JOIN students s ON r.owner_id = s.student_id
      JOIN categories c ON r.category_id = c.category_id
      WHERE r.resource_id = ?`,
      [id]
    );

    if (resourceRows.length === 0) {
      res.status(404).json({ success: false, message: 'Resource not found.' });
      return;
    }

    // Get reviews for this resource
    const [reviewRows]: any = await pool.query(
      `SELECT 
        rev.review_id,
        rev.rating,
        rev.comment,
        rev.created_at,
        s.name AS reviewer_name,
        s.department AS reviewer_department,
        s.profile_image AS reviewer_avatar
      FROM reviews rev
      JOIN students s ON rev.reviewer_id = s.student_id
      WHERE rev.resource_id = ?
      ORDER BY rev.created_at DESC`,
      [id]
    );

    const ratings = reviewRows.map((r: any) => r.rating);
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : '5.0';

    res.status(200).json({
      success: true,
      resource: {
        ...resourceRows[0],
        avg_rating: parseFloat(avgRating),
        total_reviews: reviewRows.length,
        reviews: reviewRows
      }
    });
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resource.' });
  }
};

export const createResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const owner_id = req.user?.student_id;
    const { resource_name, category_id, description, condition, location, image_url } = req.body;

    if (!resource_name || !category_id || !description || !condition || !location) {
      res.status(400).json({
        success: false,
        message: 'Name, category, description, condition, and campus location are required.'
      });
      return;
    }

    const [result]: any = await pool.query(
      `INSERT INTO resources 
        (owner_id, category_id, resource_name, description, \`condition\`, availability_status, location, image_url)
       VALUES (?, ?, ?, ?, ?, 'AVAILABLE', ?, ?)`,
      [
        owner_id,
        parseInt(category_id, 10),
        resource_name,
        description,
        condition,
        location,
        image_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Resource listed successfully.',
      resource_id: result.insertId
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to add resource.' });
  }
};

export const updateResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student_id = req.user?.student_id;
    const role = req.user?.role;
    const { resource_name, category_id, description, condition, location, availability_status, image_url } = req.body;

    const [existing]: any = await pool.query(
      'SELECT owner_id FROM resources WHERE resource_id = ?',
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ success: false, message: 'Resource not found.' });
      return;
    }

    if (existing[0].owner_id !== student_id && role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized. You can only update your own resources.' });
      return;
    }

    await pool.query(
      `UPDATE resources
       SET resource_name = COALESCE(?, resource_name),
           category_id = COALESCE(?, category_id),
           description = COALESCE(?, description),
           \`condition\` = COALESCE(?, \`condition\`),
           location = COALESCE(?, location),
           availability_status = COALESCE(?, availability_status),
           image_url = COALESCE(?, image_url)
       WHERE resource_id = ?`,
      [
        resource_name,
        category_id ? parseInt(category_id, 10) : null,
        description,
        condition,
        location,
        availability_status,
        image_url,
        id
      ]
    );

    res.status(200).json({ success: true, message: 'Resource updated successfully.' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to update resource.' });
  }
};

export const deleteResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student_id = req.user?.student_id;
    const role = req.user?.role;

    const [existing]: any = await pool.query(
      'SELECT owner_id, availability_status FROM resources WHERE resource_id = ?',
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ success: false, message: 'Resource not found.' });
      return;
    }

    if (existing[0].owner_id !== student_id && role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized. You can only delete your own resources.' });
      return;
    }

    if (existing[0].availability_status === 'BORROWED') {
      res.status(400).json({
        success: false,
        message: 'Cannot delete a resource that is currently borrowed by a student.'
      });
      return;
    }

    await pool.query('DELETE FROM resources WHERE resource_id = ?', [id]);
    res.status(200).json({ success: true, message: 'Resource deleted successfully.' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource.' });
  }
};

export const getMyResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student_id = req.user?.student_id;

    const [rows]: any = await pool.query(
      `SELECT 
        r.resource_id,
        r.resource_name,
        r.description,
        r.condition,
        r.availability_status,
        r.image_url,
        r.location,
        r.created_at,
        c.category_name,
        COUNT(DISTINCT req.request_id) AS pending_requests_count,
        COALESCE(ROUND(AVG(rev.rating), 1), 5.0) AS avg_rating
      FROM resources r
      JOIN categories c ON r.category_id = c.category_id
      LEFT JOIN borrow_requests req ON r.resource_id = req.resource_id AND req.status = 'PENDING'
      LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
      WHERE r.owner_id = ?
      GROUP BY r.resource_id, c.category_id
      ORDER BY r.created_at DESC`,
      [student_id]
    );

    res.status(200).json({ success: true, count: rows.length, resources: rows });
  } catch (error) {
    console.error('Get my resources error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve your resources.' });
  }
};
