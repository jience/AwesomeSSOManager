class SSOUser:
    """
    Standardized user information returned by any SSO handler.
    """
    def __init__(self, external_id, email, username=None, raw_data=None):
        self.external_id = external_id  # The unique ID from the third-party system
        self.email = email
        self.username = username or email.split('@')[0]
        self.raw_data = raw_data or {}

    def to_dict(self):
        return {
            "external_id": self.external_id,
            "email": self.email,
            "username": self.username
        }
