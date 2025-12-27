from onelogin.saml2.auth import OneLogin_Saml2_Auth
from flask import request
from ..base import SSOHandler
from ..models import SSOUser

class SAML2Handler(SSOHandler):
    """
    SAML2 implementation using python3-saml.
    """
    def _prepare_saml_request(self, config, callback_url):
        # Translate our internal ProviderConfig to python3-saml settings format
        return {
            "strict": False, # Set to True in production!
            "debug": True,
            "sp": {
                "entityId": f"{callback_url}/metadata",
                "assertionConsumerService": {
                    "url": callback_url,
                    "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                }
            },
            "idp": {
                "entityId": config.get('issuer'),
                "singleSignOnService": {
                    "url": config.get('entryPoint'),
                    "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                },
                "x509cert": config.get('cert', '')
            }
        }

    def _get_request_data(self):
        # Prepare data structure for python3-saml from Flask request
        return {
            'https': 'on' if request.is_secure else 'off',
            'http_host': request.host,
            'script_name': request.path,
            'server_port': request.environ.get('SERVER_PORT'),
            'get_data': request.args.copy(),
            'post_data': request.form.copy()
        }

    def get_login_url(self, config, callback_url):
        req_data = self._get_request_data()
        saml_settings = self._prepare_saml_request(config, callback_url)
        auth = OneLogin_Saml2_Auth(req_data, saml_settings)
        
        # SAML uses redirect by default for the login request
        return auth.login()

    def authenticate(self, config, request_params, callback_url):
        # SAML callback data usually comes in via POST (SAMLResponse)
        req_data = self._get_request_data()
        saml_settings = self._prepare_saml_request(config, callback_url)
        auth = OneLogin_Saml2_Auth(req_data, saml_settings)
        
        auth.process_response()
        errors = auth.get_errors()
        
        if not auth.is_authenticated():
            error_reason = auth.get_last_error_reason()
            raise ValueError(f"SAML Authentication failed: {', '.join(errors)} ({error_reason})")

        # Extract attributes mapped from SAML assertion
        attributes = auth.get_attributes()
        # Common SAML attribute names vary by provider (Okta, Azure, etc.)
        email = attributes.get('email', attributes.get('Email', attributes.get('User.Email', [None])))[0]
        name = attributes.get('name', attributes.get('DisplayName', [None]))[0]
        
        return SSOUser(
            external_id=auth.get_nameid(),
            email=email or f"{auth.get_nameid()}@saml-user.com",
            username=name or auth.get_nameid(),
            raw_data=attributes
        )
