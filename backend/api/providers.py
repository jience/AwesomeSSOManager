import uuid
import time
from flask import Blueprint, request, jsonify
from .auth import token_required
from extensions import db
from models import Provider

providers_bp = Blueprint('providers_api', __name__)

@providers_bp.route('', methods=['GET'])
@token_required
def get_providers(current_user):
    """Get all providers."""
    providers = Provider.query.all()
    return jsonify([p.to_dict() for p in providers])

@providers_bp.route('/<provider_id>', methods=['GET'])
@token_required
def get_provider(current_user, provider_id):
    """Get a single provider by ID."""
    provider = Provider.query.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404
    return jsonify(provider.to_dict())

@providers_bp.route('', methods=['POST'])
@token_required
def create_provider(current_user):
    """Create a new provider."""
    data = request.get_json()
    if not data or not data.get('name') or not data.get('type'):
        return jsonify({'error': 'Missing required fields'}), 400

    new_provider = Provider(
        name=data.get('name'),
        type=data.get('type'),
        logo=data.get('logo', ''),
        is_enabled=data.get('isEnabled', True),
        description=data.get('description', '')
    )
    # Set config using the property setter which handles JSON serialization
    new_provider.config = data.get('config', {})
    
    db.session.add(new_provider)
    db.session.commit()
    
    return jsonify(new_provider.to_dict()), 201

@providers_bp.route('/<provider_id>', methods=['PUT'])
@token_required
def update_provider(current_user, provider_id):
    """Update an existing provider."""
    provider = Provider.query.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    # Update fields from request data
    if 'name' in data: provider.name = data['name']
    if 'type' in data: provider.type = data['type']
    if 'logo' in data: provider.logo = data['logo']
    if 'isEnabled' in data: provider.is_enabled = data['isEnabled']
    if 'description' in data: provider.description = data['description']
    
    # Handle config separately
    if 'config' in data:
        # Merge or replace config? Usually replace for simplicity in PUT
        # To merge: provider.config = {**provider.config, **data['config']}
        provider.config = data['config']
            
    db.session.commit()
    return jsonify(provider.to_dict())

@providers_bp.route('/<provider_id>', methods=['DELETE'])
@token_required
def delete_provider(current_user, provider_id):
    """Delete a provider."""
    provider = Provider.query.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404
    
    db.session.delete(provider)
    db.session.commit()
    return jsonify({'message': 'Provider deleted successfully'}), 200

