// importFAQ.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import FAQ from './src/models/faqModel.js';

dotenv.config(); // Load .env variables

const MONGO_URI = process.env.MONGO_URI;

// Remove unwanted citation references
const cleanAnswer = (text) =>
  text.replace(/:contentReference\[oaicite:\d+]{index=\d+}/g, '').trim();

const loadData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    const filePath = path.resolve('./src/data/faq_data.json');
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!Array.isArray(rawData)) {
      throw new Error('❌ JSON must be an array of objects');
    }

    // Clean and prepare data
    const cleanedFAQs = rawData.map((item) => ({
      question: item.question.trim(),
      answer: cleanAnswer(item.answer),
    }));

    // Delete all existing FAQs
    await FAQ.deleteMany();
    console.log('🗑️ All existing FAQs deleted');

    // Insert new cleaned FAQs
    const result = await FAQ.insertMany(cleanedFAQs);
    console.log(`✅ Successfully inserted ${result.length} new FAQs`);

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

loadData();
