import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables at the very beginning
load_dotenv()

# Import your blueprint AFTER loading the environment
from src.routes.faq_routes import chat_bp

# Create the Flask application
app = Flask(__name__)

# Enable CORS for your frontend
CORS(app)

# Register the blueprint with the '/api' prefix
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route("/")
def index():
    return "FAQ Bot API is running!"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)