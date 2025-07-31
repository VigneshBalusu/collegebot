import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env if running locally
load_dotenv()

# Import your blueprint AFTER loading env vars
from src.routes.faq_routes import chat_bp

# Create Flask app
app = Flask(__name__)

# Enable CORS for frontend access
CORS(app)

# Register blueprint with API prefix
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route("/")
def index():
    return "✅ RCE FAQ Bot API is running!"

if __name__ == "__main__":
    # Use dynamic port for deployment (Render will set the PORT)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
