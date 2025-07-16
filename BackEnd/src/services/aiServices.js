// src/services/aiServices.js

import stringSimilarity from 'string-similarity';
import { findBestMatch } from '../ai/faqEngine.js'; // ✅ correct relative path

// Keyword-based fallback answers
const keywords = {
  admission: 'For admission-related queries, please visit our admissions portal or contact the admin office.',
  fees: 'Fee details can be found on the official RCE website under the "Fees Structure" section.',
  hostel: 'Yes, we provide separate hostel facilities for boys and girls.',
  placement: 'Our placement cell has a strong record with top recruiters visiting every year.',
  courses: 'We offer Engineering, MBA, and MCA programs across various disciplines.',
  contact: 'You can reach us at contact@rce.edu or call +91-9876543210.',
};

/**
 * Keyword-based fallback if no FAQ match is found.
 */
function getKeywordMatch(message) {
  const lowerMessage = message.toLowerCase();
  const keywordList = Object.keys(keywords);
  const words = lowerMessage.split(/\s+/);

  for (const word of words) {
    const { bestMatch } = stringSimilarity.findBestMatch(word, keywordList);
    if (bestMatch.rating >= 0.7) {
      return keywords[bestMatch.target];
    }
  }

  return null;
}

/**
 * Unified AI response: tries structured FAQ match first, then keyword fallback.
 */
export function getAIResponse(message) {
  const faqResponse = findBestMatch(message);
  if (faqResponse) {
    return faqResponse;
  }

  const keywordResponse = getKeywordMatch(message);
  if (keywordResponse) {
    return keywordResponse;
  }

  return "❗ Sorry, I couldn’t understand your question. Please try rephrasing it.";
}
