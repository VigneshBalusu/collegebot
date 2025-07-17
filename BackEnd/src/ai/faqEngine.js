// src/ai/faqEngine.js

import mongoose from 'mongoose';
import stringSimilarity from 'string-similarity';
import dotenv from 'dotenv';
import FAQ from '../models/faqModel.js'; // Adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
let cachedFAQs = [];

// 🧼 Remove citations like :contentReference[oaicite:6]{index=6}
const cleanAnswer = (text) =>
  text.replace(/:contentReference\[oaicite:\d+]{index=\d+}/g, '').trim();

// Normalize for comparison
const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();

/**
 * Fetch and clean FAQ data from MongoDB
 */
async function loadFAQData() {
  if (!cachedFAQs.length) {
    try {
      if (!mongoose.connection.readyState) {
        await mongoose.connect(MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB (faqEngine)');
      }

      const faqs = await FAQ.find({});

      // Clean answers while loading
      cachedFAQs = faqs.map(faq => ({
        question: normalize(faq.question),
        answer: cleanAnswer(faq.answer),
        original: faq.question,
      }));

      console.log(`✅ Loaded and cleaned ${cachedFAQs.length} FAQs`);
    } catch (err) {
      console.error('❌ Failed to load FAQ data:', err.message);
      cachedFAQs = [];
    }
  }
}

/**
 * Find the best matching answer using fuzzy logic
 */
export async function findBestMatch(userInput) {
  if (!userInput) return '⚠️ Please enter a valid question.';

  await loadFAQData();

  if (!cachedFAQs.length) {
    return '⚠️ FAQ data is currently unavailable.';
  }

  const input = normalize(userInput);
  const questions = cachedFAQs.map(f => f.question);

  const fullMatch = stringSimilarity.findBestMatch(input, questions);

  if (fullMatch.bestMatch.rating >= 0.4) {
    return cachedFAQs[fullMatch.bestMatchIndex].answer;
  }

  // Fallback to keyword-level fuzzy match
  for (const faq of cachedFAQs) {
    const words = faq.question.split(/\s+/);
    const keywordMatch = stringSimilarity.findBestMatch(input, words);
    if (keywordMatch.bestMatch.rating >= 0.6) {
      return faq.answer;
    }
  }

  return null;
}
