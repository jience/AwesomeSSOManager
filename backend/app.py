import os
from flask import Flask, jsonify
from flask_cors import CORS

# Import Blueprints
from api.auth import auth_bp
from api.providers import providers_bp

# App Initialization
app = Flask(__name__)

# App Configuration
# In a real app, use environment variables for sensitive data.
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key')

# CORS Configuration
# Allow requests from the Vite development server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(providers_bp, url_prefix='/api/providers')

# Root Route
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Unified SSO Manager Backend"})

# Main Entry Point
if __name__ == '__main__':
    # The default port is 5000, which matches the frontend config.
    app.run(debug=True)
