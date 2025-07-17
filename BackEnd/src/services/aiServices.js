import { findBestMatch } from '../ai/faqEngine.js';

/**
 * AI chatbot response using only the structured FAQ system.
 */
export async function getAIResponse(message) {
  if (!message || message.trim().length === 0) {
    return '⚠️ Please ask a valid question.';
  }

  const faqResponse = await findBestMatch(message);

  if (faqResponse) {
    return typeof faqResponse === 'string'
      ? faqResponse
      : JSON.stringify(faqResponse);
  }

  return "❗ Sorry, I couldn’t understand your question. Please try rephrasing it.";
}
