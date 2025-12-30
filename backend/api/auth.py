import jwt
import datetime
import uuid
from functools import wraps
from flask import Blueprint, request, jsonify, current_app, redirect, url_for
from extensions import db
from models import User, Provider
from .sso import get_sso_handler

auth_bp = Blueprint('auth_api', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing or malformed!'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(username=data['username']).first()
            if not current_user:
                 return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)

    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400

    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate JWT
    token = jwt.encode({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
        })

# --- NEW SSO ROUTES ---

@auth_bp.route('/sso/login/<provider_id>')
def sso_login(provider_id):
    provider = Provider.query.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404
    
    try:
        handler = get_sso_handler(provider.type)
        # Construct the callback URL pointing to our backend
        # In production, ensure this matches your external domain
        callback_url = url_for('auth_api.sso_callback', provider_id=provider_id, _external=True)
        
        login_url = handler.get_login_url(provider.config, callback_url)
        return redirect(login_url)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/sso/callback/<provider_id>', methods=['GET', 'POST'])
def sso_callback(provider_id):
    provider = Provider.query.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404

    try:
        handler = get_sso_handler(provider.type)
        callback_url = url_for('auth_api.sso_callback', provider_id=provider_id, _external=True)
        
        # 1. Authenticate with the IdP and get standardized user info
        sso_user = handler.authenticate(provider.config, request.args, callback_url)
        
        # 2. Find or create local user
        user = User.query.filter_by(username=sso_user.username).first()
        if not user:
            # Automatic registration
            user = User(
                username=sso_user.username,
                email=sso_user.email,
                password=str(uuid.uuid4()), # Random password
                role='user'
            )
            db.session.add(user)
            db.session.commit()
        
        # 3. Generate system JWT
        token = jwt.encode({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        # 4. Redirect back to frontend with the token
        frontend_url = f"http://localhost:5173/#/?token={token}"
        return redirect(frontend_url)
        
    except Exception as e:
        return redirect(f"http://localhost:5173/#/?error={str(e)}")
