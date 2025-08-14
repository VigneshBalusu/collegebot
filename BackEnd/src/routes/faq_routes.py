import os
import re
import logging
from flask import Blueprint, request, jsonify
from src.ai.embedding_engine import RceSmartBot, load_faqs_from_database

# Create blueprint
chat_bp = Blueprint("chat_bp", __name__)

# -----------------------------
# Initialize bot
# -----------------------------
bot = None
logging.info("🔄 Attempting to load FAQ data...")

try:
    faq_documents = load_faqs_from_database()
    if faq_documents:
        bot = RceSmartBot(faqs_data=faq_documents)
        logging.info("✅ Bot initialized successfully.")
    else:
        logging.warning("⚠️ No FAQ documents found. Initializing bot with empty data.")
        bot = RceSmartBot(faqs_data=[])
except Exception as e:
    logging.critical(f"🔥 Bot initialization failed: {e}", exc_info=True)
    bot = RceSmartBot(faqs_data=[])  # Fallback to empty bot to prevent crashes

# -----------------------------
# Chat endpoint
# -----------------------------
@chat_bp.route('/chat', methods=['POST'])
def chat():
    if not bot:
        logging.error("🛑 Bot is not initialized.")
        return jsonify({"error": "Chatbot not available"}), 503

    try:
        user_input = request.json.get("question", "")
        if not user_input.strip():
            return jsonify({"error": "No question provided"}), 400

        result = bot.get_answer(user_input)
        cleaned_answer = re.sub(r'\[[0-9, ]+\]', '', result['answer']).strip()

        return jsonify({
            "answer": cleaned_answer,
            "matched_question": result.get('matched_question', ''),
            "score": result.get('score', 0)
        }), 200

    except Exception as e:
        logging.error(f"Error processing chat: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
