// src/ai/faqEngine.js

import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity';
import { fileURLToPath } from 'url';

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to faq_data.json
const faqPath = path.resolve(__dirname, '../data/faq_data.json');

// Load the FAQ data
let faqData = [];
try {
  const rawData = fs.readFileSync(faqPath, 'utf-8');
  faqData = JSON.parse(rawData);
  console.log('✅ FAQ data loaded successfully');
} catch (err) {
  console.error('❌ Failed to load FAQ data:', err.message);
}

// Normalize helper function
const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();

/**
 * Finds the best matching answer from the FAQ dataset.
 * Uses fuzzy matching against individual words in questions to improve typo tolerance.
 */
export function findBestMatch(userInput) {
  if (!userInput || faqData.length === 0) {
    return '⚠️ FAQ data unavailable or input missing.';
  }

  const input = normalize(userInput);
  const normalizedFaq = faqData.map(item => ({
    original: item,
    normalized: normalize(item.question)
  }));

  // First pass: Full question similarity
  const fullMatches = stringSimilarity.findBestMatch(
    input,
    normalizedFaq.map(q => q.normalized)
  );

  if (fullMatches.bestMatch.rating >= 0.5) {
    const best = normalizedFaq[fullMatches.bestMatchIndex];
    return best.original.answer;
  }

  // Second pass: Try keyword-level comparison
  for (const item of normalizedFaq) {
    const words = item.normalized.split(/\s+/);
    const { bestMatch } = stringSimilarity.findBestMatch(input.split(/\s+/).join(' '), words);
    if (bestMatch.rating >= 0.6) {
      return item.original.answer;
    }
  }

  return null; // Let other modules handle if this doesn't work
}

