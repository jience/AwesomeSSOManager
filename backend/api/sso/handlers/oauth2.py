from authlib.integrations.requests_client import OAuth2Session

from .oidc import OIDCHandler
from ..models import SSOUser


class OAuth2Handler(OIDCHandler):
    """
    Specific handler for pure OAuth 2.0 providers (like GitHub, GitLab).
    """
    def authenticate(self, config, request_params, callback_url):
        # Many pure OAuth2 providers don't include openid in scope
        # and require manual mapping of user profile fields
        code = request_params.get('code')
        if not code:
            raise ValueError("No authorization code received")

        client = OAuth2Session(
            config.get('clientId'),
            config.get('clientSecret'),
            redirect_uri=callback_url
        )
        
        token = client.fetch_token(
            config.get('tokenUrl'),
            authorization_response=f"{callback_url}?code={code}"
        )
        
        user_info_url = config.get('userInfoUrl')
        if not user_info_url:
             raise ValueError("userInfoUrl is required for pure OAuth2 providers")
             
        resp = client.get(user_info_url)
        resp.raise_for_status()
        user_info = resp.json()

        # Custom mapping for common non-OIDC fields
        # Handles GitHub (id, email, name/login) and generic OAuth2
        external_id = str(user_info.get('id') or user_info.get('sub'))
        email = user_info.get('email')
        
        # GitHub email can be null if not public, in a real app you'd call /user/emails
        if not email and user_info.get('login'):
            email = f"{user_info.get('login')}@github-user.com"

        return SSOUser(
            external_id=external_id,
            email=email or f"{external_id}@oauth2-user.com",
            username=user_info.get('name') or user_info.get('login') or user_info.get('username') or external_id,
            raw_data=user_info
        )
