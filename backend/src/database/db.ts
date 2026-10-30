import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_share',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
};

export const pool = mysql.createPool(dbConfig);

// Helper for ACID transactions with automatic rollback on error
export async function withTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT 1 + 1 AS result');
    connection.release();
    return rows[0].result === 2;
  } catch (error) {
    console.error('MySQL connection error:', error);
    return false;
  }
}
