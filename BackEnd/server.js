// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chatRoutes from './src/routes/chatRoutes.js';
import connectDB from './src/config/db.js'; // 🔌 MongoDB config

// 📦 Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());
console.log('🔧 Middleware initialized: CORS and JSON parser');

// 🔌 Connect to MongoDB
connectDB();

// ✅ Health check route
app.get('/', (req, res) => {
  console.log('🌐 GET / - Health check route hit');
  res.send('✅ Node.js backend is up and running!');
});

// 🛑 Prevent favicon error logs in browser
app.get('/favicon.ico', (req, res) => {
  console.warn('⚠️ Favicon requested - no icon served.');
  res.status(204).end();
});

// 💬 Main Chat route
app.use('/api/chat', chatRoutes);

// 🧯 Catch-all error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
