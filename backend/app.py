import os
import uuid
from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db
from models import User, Provider
from database import USERS, PROVIDERS

# Import Blueprints
from api.auth import auth_bp
from api.providers import providers_bp
from api.dashboard import dashboard_bp

# App Initialization
app = Flask(__name__)

# App Configuration
# In a real app, use environment variables for sensitive data.
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sso.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Extensions
db.init_app(app)

# CORS Configuration
# Allow requests from the Vite development server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(providers_bp, url_prefix='/api/providers')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

# Root Route
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Unified SSO Manager Backend"})

# Main Entry Point
if __name__ == '__main__':
    # Initialize Database
    with app.app_context():
        db.create_all()
        
        # Seed Data if empty
        if not User.query.first():
            print("Seeding initial data...")
            # Seed Users
            for u_data in USERS.values():
                user = User(
                    id=u_data.get('id', str(uuid.uuid4())),
                    username=u_data['username'],
                    email=u_data['email'],
                    password=u_data['password'],
                    role=u_data['role']
                )
                db.session.add(user)
            
            # Seed Providers
            for p_data in PROVIDERS.values():
                provider = Provider(
                    id=p_data.get('id', str(uuid.uuid4())),
                    name=p_data['name'],
                    type=p_data['type'],
                    logo=p_data.get('logo', ''),
                    is_enabled=p_data.get('isEnabled', True),
                    description=p_data.get('description', ''),
                    created_at=p_data.get('createdAt')
                )
                # Use the setter to store config
                provider.config = p_data.get('config', {})
                db.session.add(provider)
            
            db.session.commit()
            print("Data seeded successfully.")

    # The default port is 5000, which matches the frontend config.
    app.run(debug=True)
