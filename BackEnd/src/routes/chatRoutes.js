// routes/chatRoutes.js
import express from 'express';
import { getAIResponse } from '../services/aiServices.js'; // ✅ use the smart handler

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log('📨 Received message:', message);

  try {
    const reply = getAIResponse(message); // ✅ use unified responder
    console.log('💬 Matched reply:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Internal matching error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
