import uuid
import time
from flask import Blueprint, request, jsonify
from .auth import token_required
from database import PROVIDERS

providers_bp = Blueprint('providers_api', __name__)

@providers_bp.route('', methods=['GET'])
@token_required
def get_providers(current_user):
    """Get all providers."""
    return jsonify(list(PROVIDERS.values()))

@providers_bp.route('/<provider_id>', methods=['GET'])
@token_required
def get_provider(current_user, provider_id):
    """Get a single provider by ID."""
    provider = PROVIDERS.get(provider_id)
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404
    return jsonify(provider)

@providers_bp.route('', methods=['POST'])
@token_required
def create_provider(current_user):
    """Create a new provider."""
    data = request.get_json()
    if not data or not data.get('name') or not data.get('type'):
        return jsonify({'error': 'Missing required fields'}), 400

    new_id = str(uuid.uuid4())
    new_provider = {
        'id': new_id,
        'name': data.get('name'),
        'type': data.get('type'),
        'logo': data.get('logo', ''),
        'isEnabled': data.get('isEnabled', True),
        'description': data.get('description', ''),
        'config': data.get('config', {}),
        'createdAt': int(time.time()),
    }
    PROVIDERS[new_id] = new_provider
    return jsonify(new_provider), 201

@providers_bp.route('/<provider_id>', methods=['PUT'])
@token_required
def update_provider(current_user, provider_id):
    """Update an existing provider."""
    if provider_id not in PROVIDERS:
        return jsonify({'error': 'Provider not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    provider = PROVIDERS[provider_id]
    
    # Update fields from request data
    for key, value in data.items():
        if key in provider and key != 'id': # Do not allow changing the ID
            provider[key] = value
            
    PROVIDERS[provider_id] = provider
    return jsonify(provider)

@providers_bp.route('/<provider_id>', methods=['DELETE'])
@token_required
def delete_provider(current_user, provider_id):
    """Delete a provider."""
    if provider_id not in PROVIDERS:
        return jsonify({'error': 'Provider not found'}), 404
    
    del PROVIDERS[provider_id]
    return jsonify({'message': 'Provider deleted successfully'}), 200

