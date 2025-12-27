from .handlers.oidc import OIDCHandler
from .handlers.cas import CASHandler
from .handlers.saml import SAML2Handler
from .handlers.oauth2 import OAuth2Handler

_HANDLERS = {
    'OIDC': OIDCHandler(),
    'OAUTH2': OAuth2Handler(),
    'CAS': CASHandler(),
    'SAML2': SAML2Handler()
}

def get_sso_handler(protocol_type):
    """
    Factory function to get the appropriate handler for a protocol.
    """
    handler = _HANDLERS.get(protocol_type.upper())
    if not handler:
        raise ValueError(f"Unsupported SSO protocol: {protocol_type}")
    return handler
