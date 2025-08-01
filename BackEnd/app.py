import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env if running locally
load_dotenv()

# Create Flask app
app = Flask(__name__)

# ✅ CORS Configuration: Allow only your frontend domain
CORS(app, origins=[
    "https://rcechatbot.netlify.app",  # Netlify frontend
    "http://localhost:5173"            # Optional: for local dev
])

# Import blueprints AFTER app creation and CORS
from src.routes.faq_routes import chat_bp

# Register blueprint with API prefix
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

if __name__ == "__main__":
    # Use dynamic port for deployment
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
