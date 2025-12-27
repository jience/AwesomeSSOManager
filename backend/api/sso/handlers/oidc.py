from authlib.integrations.requests_client import OAuth2Session
import uuid
from ..base import SSOHandler
from ..models import SSOUser

class OIDCHandler(SSOHandler):
    """
    Improved OIDC/OAuth2 handler using Authlib for better security and compliance.
    """
    def get_login_url(self, config, callback_url):
        # Create an Authlib session
        client = OAuth2Session(
            config.get('clientId'), 
            config.get('clientSecret'), 
            scope=config.get('scope', 'openid profile email'),
            redirect_uri=callback_url
        )
        
        # Build the authorization URL
        # Authlib handles state generation if needed
        authorization_url, state = client.create_authorization_url(config.get('authorizationUrl'))
        
        # Note: In a production app, you MUST store 'state' in session and verify it in authenticate()
        return authorization_url

    def authenticate(self, config, request_params, callback_url):
        code = request_params.get('code')
        if not code:
            raise ValueError("No authorization code received")

        # Create session to exchange code for token
        client = OAuth2Session(
            config.get('clientId'),
            config.get('clientSecret'),
            redirect_uri=callback_url
        )
        
        token = client.fetch_token(
            config.get('tokenUrl'),
            authorization_response=f"{callback_url}?code={code}" # Simulating full URL for Authlib parser
        )
        
        # Fetch user info using the token
        user_info_url = config.get('userInfoUrl')
        if not user_info_url:
             # Standard OIDC fallback
             user_info_url = config.get('tokenUrl').replace('/token', '/userinfo')
             
        resp = client.get(user_info_url)
        resp.raise_for_status()
        user_info = resp.json()

        return SSOUser(
            external_id=user_info.get('sub') or user_info.get('id'),
            email=user_info.get('email'),
            username=user_info.get('name') or user_info.get('preferred_username') or user_info.get('login'),
            raw_data=user_info
        )