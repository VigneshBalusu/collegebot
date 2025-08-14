import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Create Flask app
app = Flask(__name__)

# ✅ CORS setup: allow both production and local development
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "https://rcechatbot.netlify.app",
        "http://localhost:5173"
    ]}},
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Disable strict_slashes to avoid redirect on missing/extra slash
app.url_map.strict_slashes = False

# -----------------------------
# Sample Blueprint: chat routes
# -----------------------------
from flask import Blueprint

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    
    # Example response
    response = {
        "reply": f"Received your message: {message}"
    }
    return jsonify(response), 200

# Register blueprint under /api
app.register_blueprint(chat_bp, url_prefix='/api')

# -----------------------------
# Root route to check API status
# -----------------------------
@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

# -----------------------------
# Run Flask app
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
