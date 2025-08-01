import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# ✅ Apply CORS with explicit origin and allow headers
CORS(app, origins=["https://rcechatbot.netlify.app"], methods=["GET", "POST"], allow_headers=["Content-Type"])

# Import blueprint AFTER app + CORS are initialized
from src.routes.faq_routes import chat_bp
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
