// server.js or index.js
import express from 'express';
import cors from 'cors';
import chatRoutes from './src/routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());
console.log('🔧 Middleware initialized: CORS and JSON parser');

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

// 💬 Main Chat route - connects to Python backend
app.use('/api/chat', chatRoutes);

// ✅ Catch-all error logging
app.use((err, req, res, next) => {
  console.error('💥 Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🚀 Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Node.js server is running at: http://localhost:${PORT}`);
});
