import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import blueprint AFTER loading environment variables
from src.routes.faq_routes import chat_bp

# Create Flask app
app = Flask(__name__)

# ✅ Global CORS setup (apply to all /api/* routes)
CORS(
    app,
    resources={r"/api/*": {"origins": "https://rcechatbot.netlify.app"}},
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Register the chat blueprint
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
