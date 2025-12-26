from flask import Blueprint, jsonify
from collections import Counter
from .auth import token_required
from database import PROVIDERS

dashboard_bp = Blueprint('dashboard_api', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    """
    Calculate and return dashboard statistics.
    """
    all_providers = list(PROVIDERS.values())
    
    total_providers = len(all_providers)
    active_providers = sum(1 for p in all_providers if p.get('isEnabled', False))
    
    protocol_stats = Counter(p['type'] for p in all_providers)
    
    stats = {
        "totalProviders": total_providers,
        "activeProviders": active_providers,
        "protocolStats": dict(protocol_stats)
    }
    
    return jsonify(stats)
