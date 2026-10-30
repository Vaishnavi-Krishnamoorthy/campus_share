import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './database/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkAndMarkOverdue } from './utils/overdueChecker.js';

import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import borrowingRoutes from './routes/borrowingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// System Health Check
app.get('/api/health', async (req, res) => {
  const dbHealthy = await testConnection();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    service: 'CampusShare API',
    database: dbHealthy ? 'connected (MySQL)' : 'disconnected'
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Failed to connect to MySQL database! Make sure MySQL service is running on port 3306.');
  } else {
    console.log('✅ Connected to MySQL database successfully.');
    // Check initial overdue items
    const overdueCount = await checkAndMarkOverdue();
    if (overdueCount > 0) {
      console.log(`⚠️ Processed ${overdueCount} overdue borrowing(s).`);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 CampusShare Backend API running at http://localhost:${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
