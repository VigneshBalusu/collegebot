import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import your bot blueprint
from src.routes.faq_routes import chat_bp

# Create Flask app
app = Flask(__name__)

# -----------------------------
# ✅ CORS setup
# -----------------------------
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
# Register blueprint
# -----------------------------
app.register_blueprint(chat_bp, url_prefix='/api')

# -----------------------------
# Root route
# -----------------------------
@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
