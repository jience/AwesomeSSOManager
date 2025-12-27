from abc import ABC, abstractmethod

class SSOHandler(ABC):
    """
    Abstract base class for all SSO protocol handlers.
    """
    @abstractmethod
    def get_login_url(self, config, callback_url):
        """
        Build the authorization URL to redirect the user to the IdP.
        """
        pass

    @abstractmethod
    def authenticate(self, config, request_params, callback_url):
        """
        Handle the callback from the IdP, verify credentials, and return an SSOUser.
        """
        pass
