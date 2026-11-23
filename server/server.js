import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';
import { getJwtSecret } from './security/authPolicy.js';

// Load env vars
dotenv.config();
getJwtSecret();

const app = express();
const PORT = globalThis.process?.env?.PORT || 5000;
// Bind to loopback only: the API is reachable from this machine and through the
// Vite proxy, never from the local network.
const HOST = globalThis.process?.env?.HOST || '127.0.0.1';

// 1. SECURITY: Helmet sets various HTTP headers to help protect your app
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// 2. SECURITY: CORS protection - only allow our local frontend origins
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:5180', 'http://127.0.0.1:5180', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true, // Allow cookies to be sent
}));

// 3. SECURITY: Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply to all API routes

// Middleware to parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is secure and running.' });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (!globalThis.process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`Secure Server running on port ${PORT}`);
  });
}

export default app;
