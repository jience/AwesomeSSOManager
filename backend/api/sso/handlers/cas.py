import requests
import xml.etree.ElementTree as ET
from ..base import SSOHandler
from ..models import SSOUser

class CASHandler(SSOHandler):
    def get_login_url(self, config, callback_url):
        return f"{config.get('serverUrl')}/login?service={callback_url}"

    def authenticate(self, config, request_params, callback_url):
        ticket = request_params.get('ticket')
        if not ticket:
            raise ValueError("No CAS ticket received")

        # Validate ticket
        validate_url = f"{config.get('serverUrl')}/p3/serviceValidate"
        params = {
            "service": callback_url,
            "ticket": ticket,
            "format": "JSON"
        }
        
        response = requests.get(validate_url, params=params)
        response.raise_for_status()
        data = response.json()

        success = data.get('serviceResponse', {}).get('authenticationSuccess')
        if not success:
            raise ValueError("CAS authentication failed")

        user = success.get('user')
        attributes = success.get('attributes', {})
        
        return SSOUser(
            external_id=user,
            email=attributes.get('email', f"{user}@cas-user.com"),
            username=user,
            raw_data=data
        )
