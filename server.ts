import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.js';
import { initDatabaseStore } from './server/services/dataStore.js';

import authRoutes from './server/routes/authRoutes.js';
import movieRoutes from './server/routes/movieRoutes.js';
import theatreRoutes from './server/routes/theatreRoutes.js';
import showRoutes from './server/routes/showRoutes.js';
import bookingRoutes from './server/routes/bookingRoutes.js';
import foodRoutes from './server/routes/foodRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CineBook Cinema Engine',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  // Connect to DB and initialize in-memory seed if needed
  await connectDB();
  await initDatabaseStore();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🎬 CineBook Server is live and running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CineBook server:', err);
  process.exit(1);
});
