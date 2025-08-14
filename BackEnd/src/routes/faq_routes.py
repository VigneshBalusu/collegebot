import os
import re
import logging
from flask import Blueprint, request, jsonify
from src.ai.embedding_engine import RceSmartBot, load_faqs_from_database

# Create blueprint
chat_bp = Blueprint("chat_bp", __name__)

# Log the allowed origin (for debug purposes only)
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")
logging.info(f"🌐 CORS Allowed Origin: {ALLOWED_ORIGIN}")

# Initialize bot
bot = None
logging.info("🔄 Attempting to load FAQ data and initialize bot...")

try:
    faq_documents = load_faqs_from_database()
    if faq_documents:
        bot = RceSmartBot(faqs_data=faq_documents)
        logging.info("✅ Bot initialized successfully.")
    else:
        logging.critical("❌ Bot could not be initialized because no FAQ documents were loaded from the database.")
except Exception as e:
    logging.critical(f"🔥 Critical error during bot initialization: {e}", exc_info=True)

# Chat endpoint (no trailing slash, OPTIONS allowed)
@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    # Handle CORS preflight directly
    if request.method == 'OPTIONS':
        return '', 200

    if not bot:
        logging.error("🛑 Bot is not initialized.")
        return jsonify({
            "error": "The chatbot could not be initialized. Please check the server logs for a fatal error."
        }), 503

    try:
        user_input = request.json.get("question", "")
        if not user_input.strip():
            return jsonify({"error": "No question provided"}), 400

        result = bot.get_answer(user_input)
        cleaned_answer = re.sub(r'\[[0-9, ]+\]', '', result['answer']).strip()

        return jsonify({
            "answer": cleaned_answer,
            "matched_question": result['matched_question'],
            "score": result['score']
        }), 200

    except Exception as e:
        logging.error(f"An error occurred during chat processing: {e}", exc_info=True)
        return jsonify({"error": "An internal server error occurred."}), 500
