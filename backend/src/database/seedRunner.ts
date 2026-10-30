import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runSeed() {
  console.log('🔄 Initializing CampusShare MySQL Database...');
  
  // Connect to MySQL server (without selecting DB first to create it if missing)
  const serverConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  const dbName = process.env.DB_NAME || 'campus_share';
  await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await serverConn.end();
  console.log(`✅ Verified database: ${dbName}`);

  // Connect to the specific database
  const dbConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    multipleStatements: true
  });

  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

  console.log('📂 Reading schema.sql...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await dbConn.query(schemaSql);
  console.log('✅ Schema tables, constraints, indexes, and views created.');

  console.log('📂 Reading seed.sql...');
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  await dbConn.query(seedSql);
  console.log('✅ Seed records populated successfully.');

  // Validate counts
  const [students]: any = await dbConn.query('SELECT COUNT(*) AS count FROM students');
  const [categories]: any = await dbConn.query('SELECT COUNT(*) AS count FROM categories');
  const [resources]: any = await dbConn.query('SELECT COUNT(*) AS count FROM resources');
  const [requests]: any = await dbConn.query('SELECT COUNT(*) AS count FROM borrow_requests');
  const [borrowings]: any = await dbConn.query('SELECT COUNT(*) AS count FROM borrowings');
  const [reviews]: any = await dbConn.query('SELECT COUNT(*) AS count FROM reviews');
  const [notifications]: any = await dbConn.query('SELECT COUNT(*) AS count FROM notifications');

  console.log('----------------------------------------------------');
  console.log(`📊 DB STATUS:`);
  console.log(`   Students:       ${students[0].count}`);
  console.log(`   Categories:     ${categories[0].count}`);
  console.log(`   Resources:      ${resources[0].count}`);
  console.log(`   Borrow Requests:${requests[0].count}`);
  console.log(`   Borrowings:     ${borrowings[0].count}`);
  console.log(`   Reviews:        ${reviews[0].count}`);
  console.log(`   Notifications:  ${notifications[0].count}`);
  console.log('----------------------------------------------------');
  console.log('🎉 Database migration & seed complete!');

  await dbConn.end();
}

runSeed().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
